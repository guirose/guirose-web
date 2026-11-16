type Cotizacion = {
  id: string;
  nombre: string;
  celular: string;
  tipo_documento: "dni" | "ruc" | "ce";
  documento: string;
  correo: string | null;
  comentario: string | null;
  tipo_motor: string;
  modelo: string;
  mensaje: string;
  kommo_estado: "pendiente" | "enviado" | "error";
  kommo_intentos: number;
};

const MAX_INTENTOS = 5;
const ETIQUETA = "web-cotizador";
const NOMBRE_DOCUMENTO = { dni: "DNI", ruc: "RUC", ce: "Carné de extranjería" } as const;

const env = (nombre: string): string => {
  const valor = Deno.env.get(nombre);
  if (!valor) throw new Error(`Falta el secreto ${nombre}`);
  return valor;
};

// Supabase con clave secreta que existe ne el servidor
function claveSecreta(): string {
  const nuevas = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (nuevas) return JSON.parse(nuevas).default;
  return env("SUPABASE_SERVICE_ROLE_KEY");
}

async function supabase(ruta: string, opciones: RequestInit = {}): Promise<Response> {
  const clave = claveSecreta();
  const cabeceras: Record<string, string> = { apikey: clave, "Content-Type": "application/json" };
  if (!clave.startsWith("sb_")) cabeceras.Authorization = `Bearer ${clave}`;
  const r = await fetch(`${env("SUPABASE_URL")}/rest/v1/${ruta}`, {
    ...opciones,
    headers: { ...cabeceras, ...(opciones.headers as Record<string, string>) },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

const leerCotizacion = async (id: string): Promise<Cotizacion | undefined> => (await (await supabase(`cotizaciones?id=eq.${id}&select=*`)).json())[0];

const leerPendientes = async (): Promise<Cotizacion[]> =>
  (await supabase(
    `cotizaciones?kommo_estado=neq.enviado&kommo_intentos=lt.${MAX_INTENTOS}&order=creada_en.asc&limit=10&select=*`,
  )).json();

const actualizar = (id: string, cambios: Record<string, unknown>) =>
  supabase(`cotizaciones?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(cambios),
  });

// Kommo
async function kommo(ruta: string, opciones: RequestInit = {}): Promise<Response> {
  const r = await fetch(`https://${env("KOMMO_SUBDOMINIO")}.kommo.com/api/v4${ruta}`, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${env("KOMMO_TOKEN")}`,
      "Content-Type": "application/json",
      ...(opciones.headers as Record<string, string>),
    },
  });
  if (!r.ok) throw new Error(`Kommo ${r.status} en ${ruta}: ${(await r.text()).slice(0, 300)}`);
  return r;
}

const soloDigitos = (t: string) =>  t.replace(/\D/g, "");

// formato que llega a kommo +51 999 999 999
const formatoKommo = (celular: string) => `+51 ${celular.replace(/(\d{3})(?=\d)/g, "$1 ")}`;

// busca contacto 
async function buscarContacto(celular: string): Promise<number | undefined> {
  for (const consulta of [celular, formatoKommo(celular)]) {
    const id = await buscarPor(consulta, celular);
    if (id) return id;
  }
  return undefined;
}

async function buscarPor(consulta: string, celular: string): Promise<number | undefined> {
  const r = await kommo(`/contacts?query=${encodeURIComponent(consulta)}&limit=10`);
  if (r.status === 204) return undefined;
  const datos = await r.json();
  const contactos: { id: number; custom_fields_values?: { field_code?: string; values: { value: string }[] }[] }[] =
    datos?._embedded?.contacts ?? [];
  const coincide = contactos.find((c) =>
    (c.custom_fields_values ?? []).some(
      (f) => f.field_code === "PHONE" && f.values.some((v) => soloDigitos(v.value).endsWith(celular)),
    ),
  );
  return coincide?.id;
}

const codigoDe = (id: string) => `GR-${id.slice(0, 6).toUpperCase()}`;

function textoNota(c: Cotizacion): string {
  return [
    `Cotización web ${codigoDe(c.id)}`,
    `${NOMBRE_DOCUMENTO[c.tipo_documento]}: ${c.documento}`,
    c.correo ? `Correo: ${c.correo}` : null,
    c.comentario ? `Comentario del cliente: ${c.comentario}` : null,
    "",
    "Mensaje preparado para WhatsApp:",
    c.mensaje,
  ].filter((linea) => linea !== null).join("\n");
}

async function crearLead(c: Cotizacion): Promise<number> {
  const nombreLead = `${c.nombre.toUpperCase()} - ${c.modelo}`;
  const telefono = formatoKommo(c.celular);
  const contactoId = await buscarContacto(c.celular);
  const etiquetas = [{ name: ETIQUETA }];

  let leadId: number;
  if (contactoId) {
    // el cliente existe en Kommo y el lead nuevo se une a ese contacto
    const r = await kommo("/leads", {
      method: "POST",
      body: JSON.stringify([
        { name: nombreLead, _embedded: { tags: etiquetas, contacts: [{ id: contactoId }] } },
      ]),
    });
    leadId = (await r.json())._embedded.leads[0].id;
  } else {
    // cliente nuevo, lead y contacto en una sola petición
    const campos = [{ field_code: "PHONE", values: [{ value: telefono, enum_code: "MOB" }] }];
    if (c.correo) campos.push({ field_code: "EMAIL", values: [{ value: c.correo, enum_code: "WORK" }] });
    const r = await kommo("/leads/complex", {
      method: "POST",
      body: JSON.stringify([
        {
          name: nombreLead,
          _embedded: { tags: etiquetas, contacts: [{ name: c.nombre, custom_fields_values: campos }] },
        },
      ]),
    });
    leadId = (await r.json())[0].id;
  }

  await kommo("/leads/notes", {
    method: "POST",
    body: JSON.stringify([{ entity_id: leadId, note_type: "common", params: { text: textoNota(c) } }]),
  });
  return leadId;
}

async function procesar(c: Cotizacion): Promise<string> {
  if (c.kommo_estado === "enviado") return `${c.id}: ya estaba enviada`;
  try {
    const leadId = await crearLead(c);
    await actualizar(c.id, {
      kommo_estado: "enviado",
      kommo_lead_id: leadId,
      kommo_enviado_en: new Date().toISOString(),
      kommo_intentos: c.kommo_intentos + 1,
      kommo_error: null,
    });
    return `${c.id}: enviada (lead ${leadId})`;
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    await actualizar(c.id, {
      kommo_estado: "error",
      kommo_intentos: c.kommo_intentos + 1,
      kommo_error: motivo.slice(0, 500),
    });
    return `${c.id}: error (${motivo})`;
  }
}

Deno.serve(async (req) => {
  // solo nuestro Database Webhook conoce este secreto
  if (req.headers.get("x-guirose-secreto") !== env("WEBHOOK_SECRETO")) {
    return new Response("No autorizado", { status: 401 });
  }

  const cuerpo = await req.json().catch(() => ({}));
  const id: string | undefined = cuerpo?.record?.id;

  const cotizaciones = id ? [await leerCotizacion(id)].filter(Boolean) as Cotizacion[] : await leerPendientes();
  const resultados = [];
  for (const c of cotizaciones) resultados.push(await procesar(c));

  return Response.json({ procesadas: resultados.length, resultados });
});