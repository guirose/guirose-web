// 1. datos fijos

const PERMISOS = "user.info.basic,video.list";
const URL_AUTORIZAR = "https://www.tiktok.com/v2/auth/authorize/";
const URL_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/";
const VIGENCIA_ESTADO_MS = 10 * 60 * 1000; // el enlace de autorización vale 10 minutos
const FORMATO_ESTADO = /^[a-f0-9]{32,64}$/;

const env = (nombre: string): string => {
  const valor = Deno.env.get(nombre);
  if (!valor) throw new Error(`Falta el secreto ${nombre}`);
  return valor;
};

const mensajeDe = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

// TikTok devuelve a esta misma función; la dirección debe ser idéntica a la registrada en la app
const direccionDeRetorno = () =>
  `${env("SUPABASE_URL")}/functions/v1/tiktok-autorizar`;

const texto = (estado: number, mensaje: string) =>
  new Response(mensaje, {
    status: estado,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

// 2. Supabase (misma forma que enviar-a-kommo)

function claveSecreta(): string {
  const nuevas = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (nuevas) return JSON.parse(nuevas).default;
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

async function supabase(
  ruta: string,
  opciones: RequestInit = {},
): Promise<Response> {
  const clave = claveSecreta();
  const cabeceras: Record<string, string> = {
    apikey: clave,
    "Content-Type": "application/json",
  };
  if (!clave.startsWith("sb_")) cabeceras.Authorization = `Bearer ${clave}`;
  const r = await fetch(`${env("SUPABASE_URL")}/rest/v1/${ruta}`, {
    ...opciones,
    headers: { ...cabeceras, ...(opciones.headers as Record<string, string>) },
  });
  if (!r.ok)
    throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

// 3. paso 1

// compara dos textos sin que el tiempo de respuesta delate cuántas letras acertó
function iguales(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diferencia = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    diferencia |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diferencia === 0;
}

async function iniciar(url: URL): Promise<Response> {
  const clave = url.searchParams.get("clave") ?? "";
  if (!iguales(clave, env("VIDEOS_SECRETO")))
    return texto(401, "No autorizado.");

  // código aleatorio de un solo uso: 16 bytes = 32 letras y números
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const estado = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  // de paso se borran los códigos de más de un día que nadie usó
  const viejos = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await supabase(`tiktok_estados?creado_en=lt.${encodeURIComponent(viejos)}`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
  await supabase("tiktok_estados", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ estado }),
  });

  const parametros = new URLSearchParams({
    client_key: env("TIKTOK_CLIENT_KEY"),
    scope: PERMISOS,
    response_type: "code",
    redirect_uri: direccionDeRetorno(),
    state: estado,
  });
  return Response.redirect(`${URL_AUTORIZAR}?${parametros}`, 302);
}

// 4. paso 2

async function volver(url: URL): Promise<Response> {
  const rechazo = url.searchParams.get("error");
  if (rechazo)
    return texto(
      400,
      `TikTok no dio el permiso (${rechazo}). Si fue un error, empieza de nuevo.`,
    );

  const code = url.searchParams.get("code") ?? "";
  const estado = url.searchParams.get("state") ?? "";
  if (!code || !FORMATO_ESTADO.test(estado))
    return texto(400, "Faltan datos en la respuesta de TikTok.");

  // el código vale una sola vez se borra al usarlo, y solo sirve si es reciente
  const limite = new Date(Date.now() - VIGENCIA_ESTADO_MS).toISOString();
  const usados = await (
    await supabase(
      `tiktok_estados?estado=eq.${estado}&creado_en=gt.${encodeURIComponent(limite)}`,
      {
        method: "DELETE",
        headers: { Prefer: "return=representation" },
      },
    )
  ).json();
  if (!Array.isArray(usados) || usados.length === 0) {
    return texto(
      400,
      "El enlace venció o ya se usó. Empieza de nuevo desde el inicio.",
    );
  }

  // se cambia el código por los tokens
  const respuesta = await fetch(URL_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY"),
      client_secret: env("TIKTOK_CLIENT_SECRET"),
      code,
      grant_type: "authorization_code",
      redirect_uri: direccionDeRetorno(),
    }),
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (
    !respuesta.ok ||
    !datos.access_token ||
    !datos.refresh_token ||
    !datos.open_id
  ) {
    // solo se anota el motivo, nunca los tokens
    console.error(
      "TikTok no entregó los tokens:",
      respuesta.status,
      datos.error,
      datos.error_description,
    );
    return texto(
      502,
      "TikTok no entregó el permiso. Mira los Logs de la función y empieza de nuevo.",
    );
  }

  const ahora = Date.now();
  await supabase("tiktok_cuenta?on_conflict=id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({
      id: true,
      open_id: datos.open_id,
      access_token: datos.access_token,
      refresh_token: datos.refresh_token,
      access_expira: new Date(
        ahora + Number(datos.expires_in) * 1000,
      ).toISOString(),
      refresh_expira: new Date(
        ahora + Number(datos.refresh_expires_in) * 1000,
      ).toISOString(),
      scope: datos.scope ?? null,
      ultimo_error: null,
      actualizado_en: new Date(ahora).toISOString(),
    }),
  });

  const falta = String(datos.scope ?? "").includes("video.list")
    ? ""
    : " Ojo: TikTok no concedió el permiso video.list.";
  return texto(
    200,
    `Listo: la cuenta de TikTok quedó conectada. Puedes cerrar esta pestaña.${falta}`,
  );
}

// 5. punto de entrada

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "GET") return texto(405, "Método no permitido.");
    const url = new URL(req.url);
    // con "code" o "error" es TikTok que vuelve; si no, es el inicio
    if (url.searchParams.has("code") || url.searchParams.has("error"))
      return await volver(url);
    return await iniciar(url);
  } catch (error) {
    console.error(mensajeDe(error));
    return texto(500, "Hubo un error. Revisa los Logs de la función.");
  }
});