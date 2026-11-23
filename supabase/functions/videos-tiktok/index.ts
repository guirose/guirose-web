// 1. datos fijos

const PERFIL = "guirose_pe"; // solo se aceptan videos de esta cuenta
const URL_TOKEN = "https://open.tiktokapis.com/v2/oauth/token/";
const URL_LISTA = "https://open.tiktokapis.com/v2/video/list/";
const CAMPOS =
  "id,title,video_description,duration,cover_image_url,create_time";
const POR_PAGINA = 20; // máximo que permite TikTok
const MAX_PAGINAS = 50; // tope de seguridad: 1 000 videos
const MAX_TAPAS_POR_EJECUCION = 60; // las demás se copian en la siguiente revisión
const PRESUPUESTO_TAPAS_MS = 100_000; // pasado este tiempo no se empiezan tapas nuevas (Supabase corta cerca de los 150 s)
const CONCURRENCIA = 4; // videos que se procesan a la vez
const INTENTOS_TAPA = 3; // TikTok a veces responde 429 o 5xx si se piden muchas tapas seguidas
const LIMITE_TAPA_BYTES = 512 * 1024; // el mismo límite de la carpeta tapas-videos
const BLOQUEO_MS = 10 * 60 * 1000; // una revisión colgada libera su turno a los 10 minutos
const DIAS_DE_AVISO = 30; // faltando tantos días para que venza el permiso, se avisa
const FORMATO_ID = /^[0-9]{8,25}$/;
const TIPOS_DE_IMAGEN: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const env = (nombre: string): string => {
  const valor = Deno.env.get(nombre);
  if (!valor) throw new Error(`Falta el secreto ${nombre}`);
  return valor;
};

const mensajeDe = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const texto = (estado: number, mensaje: string) =>
  new Response(mensaje, {
    status: estado,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

const json = (estado: number, datos: unknown) =>
  new Response(JSON.stringify(datos, null, 2), {
    status: estado,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

// aviso para el caso "ya hay otra revisión corriendo" (no es un fallo)
class RevisionEnCurso extends Error {}

type Cuenta = {
  open_id: string;
  access_token: string;
  refresh_token: string;
  access_expira: string;
  refresh_expira: string;
  scope: string | null;
};

type VideoTikTok = {
  id: string;
  title?: string;
  video_description?: string;
  duration?: number;
  cover_image_url?: string;
  create_time?: number;
};

type FilaVideo = {
  id: string;
  tiktok_id: string | null;
  enlace: string;
  estado: string;
  tapa_url: string | null;
  duracion: number | null;
};

// 2. Supabase

function claveSecreta(): string {
  const nuevas = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (nuevas) return JSON.parse(nuevas).default;
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

function cabecerasSupabase(): Record<string, string> {
  const clave = claveSecreta();
  const cabeceras: Record<string, string> = { apikey: clave };
  if (!clave.startsWith("sb_")) cabeceras.Authorization = `Bearer ${clave}`;
  return cabeceras;
}

async function supabase(
  ruta: string,
  opciones: RequestInit = {},
): Promise<Response> {
  const r = await fetch(`${env("SUPABASE_URL")}/rest/v1/${ruta}`, {
    ...opciones,
    headers: {
      ...cabecerasSupabase(),
      "Content-Type": "application/json",
      ...(opciones.headers as Record<string, string>),
    },
  });
  if (!r.ok)
    throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

// guarda campos en la única fila de tiktok_cuenta
async function guardarCuenta(campos: Record<string, unknown>): Promise<void> {
  await supabase("tiktok_cuenta?id=eq.true", {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      ...campos,
      actualizado_en: new Date().toISOString(),
    }),
  });
}

// 3. turno y renovación del permiso

// Solo una revisión a la vez: TikTok cambia el token en cada renovación y el anterior deja de servir
async function reservarTurno(): Promise<Cuenta> {
  const existe = await (
    await supabase("tiktok_cuenta?id=eq.true&select=id")
  ).json();
  if (!Array.isArray(existe) || existe.length === 0) {
    throw new Error(
      "Todavía no se conectó la cuenta de TikTok. Abre primero el enlace de tiktok-autorizar.",
    );
  }
  const limite = new Date(Date.now() - BLOQUEO_MS).toISOString();
  const filas = await (
    await supabase(
      `tiktok_cuenta?id=eq.true&or=(sincronizando_desde.is.null,sincronizando_desde.lt.${encodeURIComponent(limite)})`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ sincronizando_desde: new Date().toISOString() }),
      },
    )
  ).json();
  if (!Array.isArray(filas) || filas.length === 0) throw new RevisionEnCurso();
  return filas[0] as Cuenta;
}

// Pide un permiso nuevo a TikTok y lo guarda ANTES de hacer cualquier otra cosa
async function renovarPermiso(cuenta: Cuenta): Promise<Cuenta> {
  if (Date.parse(cuenta.refresh_expira) <= Date.now()) {
    throw new Error(
      "El permiso de TikTok venció. Vuelve a autorizar con el enlace de tiktok-autorizar.",
    );
  }
  const respuesta = await fetch(URL_TOKEN, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({
      client_key: env("TIKTOK_CLIENT_KEY"),
      client_secret: env("TIKTOK_CLIENT_SECRET"),
      grant_type: "refresh_token",
      refresh_token: cuenta.refresh_token,
    }),
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || !datos.access_token || !datos.refresh_token) {
    // solo se anota el motivo, nunca los tokens
    throw new Error(
      `TikTok no renovó el permiso (${respuesta.status} ${datos.error ?? "sin detalle"}). ` +
        "Si se repite, vuelve a autorizar con el enlace de tiktok-autorizar.",
    );
  }
  if (datos.scope && !String(datos.scope).includes("video.list")) {
    throw new Error(
      "TikTok no tiene el permiso video.list. Vuelve a autorizar y deja marcados los dos permisos.",
    );
  }

  const ahora = Date.now();
  const nueva: Cuenta = {
    open_id: datos.open_id ?? cuenta.open_id,
    access_token: datos.access_token,
    refresh_token: datos.refresh_token,
    access_expira: new Date(
      ahora + Number(datos.expires_in) * 1000,
    ).toISOString(),
    refresh_expira: new Date(
      ahora + Number(datos.refresh_expires_in) * 1000,
    ).toISOString(),
    scope: datos.scope ?? cuenta.scope,
  };
  try {
    await guardarCuenta({ ...nueva });
  } catch (error) {
    // el token anterior ya no sirve: si no se guardó, habrá que autorizar otra vez
    console.error(
      "ATENCIÓN: TikTok entregó un permiso nuevo pero no se pudo guardar:",
      mensajeDe(error),
    );
    throw new Error(
      "No se pudo guardar el permiso nuevo. Puede ser necesario volver a autorizar.",
    );
  }
  return nueva;
}

// 4. la lista de videos de TikTok

async function traerVideos(accessToken: string): Promise<VideoTikTok[]> {
  const videos: VideoTikTok[] = [];
  let cursor: number | undefined;
  for (let pagina = 0; pagina < MAX_PAGINAS; pagina++) {
    const cuerpo: Record<string, unknown> = { max_count: POR_PAGINA };
    if (cursor !== undefined) cuerpo.cursor = cursor;
    const respuesta = await fetch(`${URL_LISTA}?fields=${CAMPOS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cuerpo),
    });
    const datos = await respuesta.json().catch(() => ({}));
    const codigo = datos?.error?.code;
    if (!respuesta.ok || (codigo && codigo !== "ok")) {
      throw new Error(
        `TikTok no entregó la lista de videos (${respuesta.status} ${codigo ?? "sin detalle"}).`,
      );
    }
    videos.push(...((datos?.data?.videos ?? []) as VideoTikTok[]));
    if (!datos?.data?.has_more) return videos;
    cursor = datos.data.cursor;
  }
  // si hay más de MAX_PAGINAS páginas, la lista está incompleta: no se puede marcar nada como faltante
  throw new Error(
    "La cuenta tiene más videos de los que esta función revisa de una vez.",
  );
}

// 5. título y tapa

const letras = (t: string) => Array.from(t); // cuenta como Postgres: emojis de 1 letra

// La base exige un título de 5 a 90 letras. Se usa el título o la descripción, sin #etiquetas.
function tituloDe(v: VideoTikTok): string {
  const base = (v.title?.trim() || v.video_description?.trim() || "")
    .replace(/#[\p{L}\p{N}_]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (letras(base).length >= 5) {
    const l = letras(base);
    return l.length <= 90 ? base : l.slice(0, 89).join("").trimEnd() + "…";
  }
  const fecha = v.create_time
    ? new Date(v.create_time * 1000).toLocaleDateString("es-PE", {
        timeZone: "America/Lima",
      })
    : v.id.slice(-6);
  return `Video de GUIROSE del ${fecha}`;
}

const esperar = (ms: number) =>
  new Promise<void>((resolver) => setTimeout(resolver, ms));

// Pide la imagen y, si TikTok responde 429 o 5xx (por ejemplo el 530 de su CDN), espera un poco y reintenta
async function bajarTapa(direccion: string): Promise<Response> {
  let ultimo = "sin respuesta";
  for (let intento = 1; intento <= INTENTOS_TAPA; intento++) {
    try {
      const r = await fetch(direccion);
      if (r.ok) return r;
      ultimo = String(r.status);
      await r.body?.cancel();
      if (r.status !== 429 && r.status < 500) break; // 403, 404...: reintentar no sirve
    } catch (error) {
      ultimo = mensajeDe(error).slice(0, 80);
    }
    if (intento < INTENTOS_TAPA) await esperar(600 * intento * intento); // 0,6 s y luego 2,4 s
  }
  throw new Error(`No se pudo bajar la tapa (${ultimo})`);
}

// Baja la tapa desde TikTok (su dirección vence a las pocas horas) y la guarda en Supabase
async function copiarTapa(v: VideoTikTok): Promise<string> {
  if (!v.cover_image_url?.startsWith("https://"))
    throw new Error("TikTok no dio la dirección de la tapa");
  const origen = await bajarTapa(v.cover_image_url);
  const tipo = (origen.headers.get("content-type") ?? "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  const extension = TIPOS_DE_IMAGEN[tipo];
  if (!extension)
    throw new Error(`Formato de tapa no admitido (${tipo || "desconocido"})`);
  const bytes = new Uint8Array(await origen.arrayBuffer());
  if (bytes.byteLength > LIMITE_TAPA_BYTES) {
    throw new Error(
      `La tapa pesa ${Math.round(bytes.byteLength / 1024)} KB y el límite es 512 KB`,
    );
  }

  const nombre = `${v.id}.${extension}`;
  const subida = await fetch(
    `${env("SUPABASE_URL")}/storage/v1/object/tapas-videos/${nombre}`,
    {
      method: "POST",
      headers: {
        ...cabecerasSupabase(),
        "Content-Type": tipo,
        "x-upsert": "true",
        "cache-control": "max-age=86400",
      },
      body: bytes,
    },
  );
  if (!subida.ok)
    throw new Error(`No se pudo guardar la tapa (${subida.status})`);
  return `${env("SUPABASE_URL")}/storage/v1/object/public/tapas-videos/${nombre}`;
}

// 6. poner la tabla al día

async function sincronizar(cuenta: Cuenta) {
  const antes = cuenta.refresh_expira;
  const permiso = await renovarPermiso(cuenta);
  const lista = await traerVideos(permiso.access_token);
  const ahora = new Date().toISOString();

  // lo que ya hay en la tabla (si algún día pasan de 1 000 videos, habrá que paginar)
  const filas = (await (
    await supabase(
      "videos?select=id,tiktok_id,enlace,estado,tapa_url,duracion&limit=1000",
    )
  ).json()) as FilaVideo[];
  const porTiktokId = new Map(
    filas.filter((f) => f.tiktok_id).map((f) => [f.tiktok_id as string, f]),
  );
  const porEnlace = new Map(filas.map((f) => [f.enlace, f]));

  const resumen = {
    nuevos: 0,
    actualizados: 0,
    tapas_copiadas: 0,
    tapas_con_problema: 0,
    tapas_para_despues: 0,
    omitidos: 0,
  };
  const problemas: string[] = [];
  const anotar = (mensaje: string) => {
    if (problemas.length < 5) problemas.push(mensaje);
  };
  let tapasIntentadas = 0;
  const inicio = Date.now();

  // Procesa un video: lo crea o lo actualiza y, si hace falta, copia su tapa
  const procesar = async (v: VideoTikTok): Promise<void> => {
    if (!FORMATO_ID.test(String(v.id))) {
      resumen.omitidos++;
      return;
    }
    const enlace = `https://www.tiktok.com/@${PERFIL}/video/${v.id}`;
    const fila = porTiktokId.get(v.id) ?? porEnlace.get(enlace);

    try {
      // la tapa solo se copia si el video todavía no tiene una (puede ser una subida a mano: no se pisa)
      let tapaUrl = fila?.tapa_url ?? null;
      let falloTapa: string | null = null;
      if (!tapaUrl) {
        if (
          tapasIntentadas < MAX_TAPAS_POR_EJECUCION &&
          Date.now() - inicio < PRESUPUESTO_TAPAS_MS
        ) {
          tapasIntentadas++;
          try {
            tapaUrl = await copiarTapa(v);
            resumen.tapas_copiadas++;
          } catch (error) {
            falloTapa = mensajeDe(error).slice(0, 200);
            resumen.tapas_con_problema++;
            anotar(`${v.id}: ${falloTapa}`);
          }
        } else {
          resumen.tapas_para_despues++;
        }
      }
      const estado = tapaUrl ? "listo" : falloTapa ? "error" : "pendiente";
      const duracion = Number.isFinite(v.duration)
        ? Math.round(Number(v.duration))
        : null;

      if (fila) {
        // el título y el motor NO se tocan: pueden estar editados por marketing
        await supabase(`videos?id=eq.${fila.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            tiktok_id: v.id,
            duracion,
            tapa_url: tapaUrl,
            estado,
            error: falloTapa,
            revisado_en: ahora,
          }),
        });
        resumen.actualizados++;
      } else {
        await supabase("videos", {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            enlace,
            titulo: tituloDe(v),
            tiktok_id: v.id,
            duracion,
            tapa_url: tapaUrl,
            estado,
            error: falloTapa,
            revisado_en: ahora,
          }),
        });
        resumen.nuevos++;
      }
    } catch (error) {
      // un video con problemas no detiene a los demás
      resumen.omitidos++;
      anotar(`${v.id}: ${mensajeDe(error).slice(0, 200)}`);
    }
  };

  // Varios trabajadores toman videos de la misma cola, de a CONCURRENCIA a la vez
  const cola = [...lista];
  const trabajador = async () => {
    for (let v = cola.shift(); v; v = cola.shift()) await procesar(v);
  };
  await Promise.all(Array.from({ length: CONCURRENCIA }, trabajador));

  // los videos que ya no están en TikTok dejan de mostrarse (no se borran)
  const enTikTok = new Set(lista.map((v) => String(v.id)));
  const faltantes = filas
    .filter(
      (f) =>
        f.tiktok_id &&
        FORMATO_ID.test(f.tiktok_id) &&
        !enTikTok.has(f.tiktok_id) &&
        f.estado !== "no_disponible",
    )
    .map((f) => f.tiktok_id as string);
  let noDisponibles = 0;
  let listaVacia = false;
  if (lista.length === 0 && faltantes.length > 0) {
    listaVacia = true; // una lista vacía parece un fallo de TikTok: no se oculta nada
  } else if (faltantes.length > 0) {
    await supabase(`videos?tiktok_id=in.(${faltantes.join(",")})`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        estado: "no_disponible",
        error: null,
        revisado_en: ahora,
      }),
    });
    noDisponibles = faltantes.length;
  }

  const diasParaReautorizar = Math.ceil(
    (Date.parse(permiso.refresh_expira) - Date.now()) / 86_400_000,
  );
  const avisos: string[] = [];
  if (diasParaReautorizar <= DIAS_DE_AVISO) {
    avisos.push(
      `El permiso de TikTok vence en ${diasParaReautorizar} días: hay que volver a autorizar.`,
    );
  }
  if (listaVacia)
    avisos.push(
      "TikTok devolvió 0 videos: no se ocultó ninguno. Revisa la cuenta.",
    );
  if (resumen.tapas_para_despues > 0)
    avisos.push("Faltan tapas por copiar: se harán en la próxima revisión.");

  return {
    ok: true,
    videos_en_tiktok: lista.length,
    ...resumen,
    no_disponibles: noDisponibles,
    problemas,
    permiso: {
      vence_antes: antes,
      vence_ahora: permiso.refresh_expira,
      se_extendio:
        Date.parse(permiso.refresh_expira) - Date.parse(antes) > 60 * 60 * 1000,
      dias_para_reautorizar: diasParaReautorizar,
    },
    avisos,
  };
}

// 7. punto de entrada

// compara dos textos sin que el tiempo de respuesta delate cuántas letras acertó
function iguales(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diferencia = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++)
    diferencia |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diferencia === 0;
}

// la revisión diaria manda la clave en una cabecera; a mano se puede usar ?clave=
function autorizado(req: Request): boolean {
  const deCabecera = req.headers.get("x-guirose-secreto");
  const deEnlace = new URL(req.url).searchParams.get("clave");
  const recibida = deCabecera ?? deEnlace ?? "";
  const esperada = env("VIDEOS_SECRETO");
  const acierta = iguales(recibida, esperada);
  if (!acierta) {
    // solo se anotan los largos y por dónde llegó, nunca las claves
    const origen =
      deCabecera !== null
        ? "cabecera"
        : deEnlace !== null
          ? "enlace"
          : "ninguno";
    console.error(
      `No autorizado: llegó por ${origen} con ${recibida.length} caracteres; la clave guardada tiene ${esperada.length}.`,
    );
  }
  return acierta;
}

async function atender(): Promise<Response> {
  const cuenta = await reservarTurno(); // si otra revisión está corriendo, lanza RevisionEnCurso
  try {
    const resumen = await sincronizar(cuenta);
    await guardarCuenta({
      sincronizado_en: new Date().toISOString(),
      ultimo_error: null,
    });
    console.log(
      "Revisión lista:",
      JSON.stringify({ ...resumen, problemas: resumen.problemas.length }),
    );
    return json(200, resumen);
  } catch (error) {
    // queda anotado en la tabla para verlo sin entrar a los Logs
    await guardarCuenta({ ultimo_error: mensajeDe(error).slice(0, 300) }).catch(
      () => {},
    );
    throw error;
  } finally {
    // se devuelve el turno pase lo que pase
    await guardarCuenta({ sincronizando_desde: null }).catch(() => {});
  }
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "GET" && req.method !== "POST")
      return texto(405, "Método no permitido.");
    if (!autorizado(req)) return texto(401, "No autorizado.");
    return await atender();
  } catch (error) {
    if (error instanceof RevisionEnCurso)
      return texto(409, "Ya hay una revisión en curso. Espera unos minutos.");
    console.error(mensajeDe(error));
    return texto(
      500,
      `No se pudo revisar los videos: ${mensajeDe(error).slice(0, 200)}`,
    );
  }
});
