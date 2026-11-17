type Seleccion = {
  medidas?: Record<string,string>;
  extensiones?: Record<string, number>;
};

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
  seleccion: Seleccion | null;
  kommo_estado: "pendiente" | "enviado" | "error";
  kommo_intentos: number;
};

const MAX_INTENTOS = 5;
const ETIQUETA = "web-cotizador";
const EMBUDO = "COMERCIAL | MOTORES";
const ETAPA = "";
const MARCA = "Mercury";
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

async function destino(): Promise<{ pipeline_id: number; status_id: number }> {
  const datos = await (await kommo("/leads/pipelines")).json();
  const embudos: { id: number, name: string; _embedded: { statuses: { id: number; name: string; sort: number; type: number }[] } } [] =
    datos?._embedded?.pipelines ?? [];
  const embudo = embudos.find((e) => e.name.trim() === EMBUDO);
  if (!embudo) throw new Error(`No existe el embudo "${EMBUDO}" en Kommo`);
  const etapas = embudo._embedded.statuses.filter((s) => s.type === 0 && s.id !== 142 && s.id !== 143);
  const etapa = ETAPA
    ? etapas.find((s) => s.name.trim() === ETAPA)
    : [...etapas].sort((a,b) => a.sort - b.sort)[0];
  if (!etapa) throw new Error(`No existe la etapa "${ETAPA}" en el embudo "${EMBUDO}"`);
  return { pipeline_id: embudo.id, status_id: etapa.id };
}

// Campos personalizados de Kommo
type OpcionKommo = { id: number; value: string };
type CampoKommo = { id: number; name: string; type: string; enums?: OpcionKommo[] | null };
type Definiciones = { leads: CampoKommo[]; contactos: CampoKommo[] };
type Valor = string | number | boolean | Date;
type Especificacion = {
  etiqueta: string;
  nombres: string[];
  valor: Valor | null | undefined;
  opciones?: string[];
};
type EntradaKommo = { field_id: number; values: Record<string, unknown>[] };

const normalizar = (t: string) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

async function leerCampos(entidad: "leads" | "contacts"): Promise<CampoKommo[]> {
  const todos: CampoKommo[] = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const r = await kommo(`/${entidad}/custom_fields?limit=250&page=${pagina}`);
    if (r.status === 204) break;
    const lote: CampoKommo[] = (await r.json())?._embedded?.custom_fields ?? [];
    todos.push(...lote);
    if (lote.length < 250) break;
  }
  return todos;
}

async function cargarDefiniciones(): Promise<Definiciones> {
  const [leads, contactos] = await Promise.all([leerCampos("leads"), leerCampos("contacts")]);
  return { leads, contactos };
}

function buscarCampo(campos: CampoKommo[], nombres: string[]): CampoKommo | undefined {
  for (const nombre of nombres) {
    const buscado = normalizar(nombre);
    const coinciden = campos.filter((c) => normalizar(c.name).includes(buscado));
    const elegido = coinciden.find((c) => normalizar(c.name).includes("objetivo")) ?? coinciden[0];
    if (elegido) return elegido;
  }
  return undefined;
}

function buscarOpcion(campo: CampoKommo, textos: string[]): number | undefined {
  const enums = campo.enums ?? [];
  for (const texto of textos.map(normalizar)) {
    const exacta = enums.find((e) => normalizar(e.value) === texto);
    if (exacta) return exacta.id;
  }
  for (const texto of textos.map(normalizar)) {
    if (texto.length < 3) continue;
    const parecida = enums.find((e) => normalizar(e.value).includes(texto));
    if (parecida) return parecida.id;
  }
  return undefined;
}

// arma el valor según el tipo de campo; devuelve texto si no se pudo (será un aviso)
function entradaDe(campo: CampoKommo, esp: Especificacion): EntradaKommo | string {
  const valor = esp.valor as Valor;
  switch (campo.type) {
    case "select":
    case "radiobutton":
    case "multiselect": {
      const textos = esp.opciones ?? [String(valor)];
      const enumId = buscarOpcion(campo, textos);
      return enumId ? { field_id: campo.id, values: [{ enum_id: enumId }] } : "no existe esa opción en la lista";
    }
    case "numeric": {
      const n = Number(valor);
      return Number.isFinite(n) ? { field_id: campo.id, values: [{ value: n }] } : "valor no numérico";
    }
    case "checkbox":
      return { field_id: campo.id, values: [{ value: Boolean(valor) }] };
    case "date":
    case "date_time": {
      const f = valor instanceof Date ? valor : new Date(String(valor));
      return Number.isNaN(f.getTime())
        ? "fecha no válida"
        : { field_id: campo.id, values: [{ value: Math.floor(f.getTime() / 1000) }] };
    }
    default: {
      // texto, párrafo, url…
      const texto = valor instanceof Date ? valor.toISOString().slice(0, 10) : String(valor);
      return { field_id: campo.id, values: [{ value: texto.slice(0, campo.type === "text" ? 250 : 2000) }] };
    }
  }
}

function construirCampos(
  campos: CampoKommo[] | undefined,
  especificaciones: Especificacion[],
): { valores: EntradaKommo[]; faltan: string[] } {
  const valores: EntradaKommo[] = [];
  const faltan: string[] = [];
  for (const esp of especificaciones) {
    if (esp.valor === null || esp.valor === undefined || esp.valor === "") continue;
    const campo = campos ? buscarCampo(campos, esp.nombres) : undefined;
    if (!campo) {
      faltan.push(`${esp.etiqueta} (no se encontró el campo)`);
      continue;
    }
    const resultado = entradaDe(campo, esp);
    if (typeof resultado === "string") faltan.push(`${esp.etiqueta} (${resultado})`);
    else valores.push(resultado);
  }
  return { valores, faltan };
}

// Dato que va en cada campo
const pies = (clave: string | undefined): number | undefined => {
  const m = clave?.match(/(\d+)ft/);
  return m ? Number(m[1]) : undefined;
};

function datosDelModelo(modelo: string) {
  const m = modelo.toUpperCase().match(/^(\d+)([A-Z]*)$/);
  const hp = m ? Number(m[1]) : undefined;
  const letras = m?.[2] ?? "";
  const cola = letras.includes("XL") ? 25 : letras.includes("L") ? 20 : 15;
  const control = letras.includes("H") ? "Mando popero" : "Control remoto";
  return { hp, cola, control };
}

function largoArnes(s: Seleccion | null): number | undefined {
  const base = pies(s?.medidas?.llave);
  if (base === undefined) return undefined;
  const extra = Object.entries(s?.extensiones ?? {}).reduce((t, [clave, cantidad]) => t+ (pies(clave) ?? 0) * cantidad, 0);
  return base + extra;
}

function camposDelContacto(c: Cotizacion): Especificacion[] {
  const tipo = c.tipo_documento;
  return [
    {
      etiqueta: "Tipo de documento",
      nombres: ["tipo de documento"],
      valor: NOMBRE_DOCUMENTO[tipo],
      // por ahora RUC se clasifica como "Otro" en Kommo
      opciones: tipo == "ce" ? ["Carné de extranjería"] : tipo === "dni" ? ["DNI"] : ["RUC", "Otro"],
    },
    { 
      etiqueta: "Número de documento", 
      nombres : ["numero de documento", "numero documento"],
      valor: c.documento
    },
    {
      etiqueta: "Términos y condiciones",
      nombres: ["terminos y condiciones", "terminos"],
      valor: true,
      opciones: ["Sí", "Si", "Acepta", "Aceptado", "Acepto"],
    },
  ];
}

function camposDelLead(c: Cotizacion): Especificacion[] {
  const { hp, cola, control } = datosDelModelo(c.modelo);
  const dosTiempos = c.tipo_motor.startsWith("2");
  const cable = c.seleccion?.medidas?.cable;
  return [
    {
      etiqueta: "Fuente / Origen",
      nombres: ["fuente", "origen"],
      valor: "Web",
      opciones: ["Web"],
    },
    {
      etiqueta: "Medio de contacto",
      nombres: ["medio de contacto", "medio"],
      valor: "WhatsApp",
      opciones: ["WhatsApp"],
    },
    {
      etiqueta: "Marca",
      nombres: ["marca"],
      valor: MARCA,
    },
    {
      etiqueta: "Ciclo",
      nombres: ["ciclo"],
      valor: dosTiempos ? "2 tiempos" : "4 tiempos",
      opciones: [dosTiempos ? "2 tiempos" : "4 tiempos"],
    },
    {
      etiqueta: "Sistema de control",
      nombres: ["sistema de control", "control"],
      valor: control,
      // control remoto mecanico para pesca artesanal
      opciones: control === "Mando popero" ? ["Popero"] : ["Remoto mecánico"],
    },
    {
      etiqueta: "Configuración del control",
      nombres: ["configuracion del control", "configuracion"],
      valor: control === "Mando popero" ? null : "Consola simple",
      opciones: ["Consola simple"],
    },
    { etiqueta: "Potencia (HP)", 
      nombres: ["potencia"], 
      valor: hp 
    },
    {
      etiqueta: "Longitud de transmisión (pulg)",
      nombres: ["longitud transmision", "transmision"],
      valor: cola,
    },
    {
      etiqueta: "Longitud de cables (pies)",
      nombres: ["longitud cables", "cables de aceleracion", "cable"],
      valor: pies(cable),
    },
    {
      etiqueta: "Longitud de arnés (pies)",
      nombres: ["longitud arnes", "arnes"],
      valor: largoArnes(c.seleccion),
    },
    {
      etiqueta: "Fecha de última cotización",
      nombres: ["fecha de ultima cotizacion", "ultima cotizacion"],
      valor: new Date(),
    },
    {
      etiqueta: "Comentario",
      nombres: ["comentario"],
      valor: c.comentario,
    },
  ];
}

function textoNota(c: Cotizacion, avisos: string[]): string {
  return [
    `Cotización web ${codigoDe(c.id)}`,
    `${NOMBRE_DOCUMENTO[c.tipo_documento]}: ${c.documento}`,
    c.correo ? `Correo: ${c.correo}` : null,
    c.comentario ? `Comentario del cliente: ${c.comentario}` : null,
    "",
    "Mensaje preparado para WhatsApp:",
    c.mensaje,
    avisos.length ? `\nCampos de Kommo sin rellenar (revisar nombres u opciones):\n- ${avisos.join("\n- ")}` : null,
  ].filter((linea) => linea !== null).join("\n");
}

async function crearLead(c: Cotizacion, defs: Definiciones | undefined, avisos: string[]): Promise<number> {
  const nombreLead = `${c.nombre.toUpperCase()} - ${c.modelo}`;
  const telefono = formatoKommo(c.celular);
  const contactoId = await buscarContacto(c.celular);
  const etiquetas = [{ name: ETIQUETA }];
  const { pipeline_id, status_id } = await destino();

  const delLead = construirCampos(defs?.leads, camposDelLead(c));
  const delContacto = construirCampos(defs?.contactos, camposDelContacto(c));
  avisos.push(...delLead.faltan, ...delContacto.faltan);

  // crea el lead con los campos y si alguno se rechaza lo reintenta con los campos vacios
  const publicar = async (conCampos: boolean): Promise<number> => {
    const camposLead = conCampos ? delLead.valores : [];
    if (contactoId) {
      // si el cliente ya existe en Kommo el lead nuevo se une a ese contacto
      const r = await kommo("/leads", {
        method: "POST",
        body: JSON.stringify([
          {
            name: nombreLead,
            pipeline_id,
            status_id,
            custom_fields_values: camposLead,
            _embedded: { tags: etiquetas, contacts: [{ id: contactoId }] },
          },
        ]),
      });
      return (await r.json())._embedded.leads[0].id;
    }
    // para clientes nuevos se crea el lead con el contacto
    const camposContacto: Record<string, unknown>[] = [
      { field_code: "PHONE", values: [{ value: telefono, enum_code: "MOB" }]},
    ];
    if (c.correo) camposContacto.push({ field_code: "EMAIL", values: [{ value: c.correo, enum_code: "WORK" }] });
    if (conCampos) camposContacto.push(...delContacto.valores);
    const r = await kommo("/leads/complex", {
      method: "POST",
      body: JSON.stringify([
        {
          name: nombreLead,
          pipeline_id,
          status_id,
          custom_fields_values: camposLead,
          _embedded: { tags: etiquetas, contacts: [{ name: c.nombre, custom_fields_values: camposContacto }] },
        },
      ]),
    });
    return (await r.json())[0].id;
  };

  let leadId: number;
  try {
    leadId = await publicar(true);
  } catch (error) {
    const motivo = error instanceof Error ? error.message : String(error);
    if (!motivo.startsWith("Kommo 400")) throw error;
    avisos.push(`Kommo rechazó los campos y el lead se creó sin ellos: ${motivo.slice(0, 200)}`);
    leadId = await publicar(false);
  }

  // para el contacto que ya existe solo se llenan sus campos de documento y si falla avisa
  if (contactoId && delContacto.valores.length) {
    try {
      await kommo("/contacts", {
        method: "PATCH",
        body: JSON.stringify([{ id: contactoId, custom_fields_values: delContacto.valores }]),
      });
    } catch (error) {
      avisos.push(`No se pudo actualizar el contacto: ${(error instanceof Error ? error.message : String(error)).slice(0, 200)}`);
    }
  }

  await kommo("/leads/notes", {
    method: "POST",
    body: JSON.stringify([{ entity_id: leadId, note_type: "common", params: { text: textoNota(c, avisos) } }]),
  });
  return leadId;
}

async function procesar(c: Cotizacion, defs: Definiciones | undefined, avisosBase: string[]): Promise<string> {
  if (c.kommo_estado === "enviado") return `${c.id}: ya estaba enviada`;
  const avisos = [...avisosBase];
  try {
    const leadId = await crearLead(c, defs, avisos);
    await actualizar(c.id, {
      kommo_estado: "enviado",
      kommo_lead_id: leadId,
      kommo_enviado_en: new Date().toISOString(),
      kommo_intentos: c.kommo_intentos + 1,
      kommo_error: null,
    });
    return `${c.id}: enviada (lead ${leadId})${avisos.length ? ` | sin rellenar: ${avisos.join("; ")}` : ""}`;
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
  let defs: Definiciones | undefined;
  const avisosBase: string[] = [];
  if (cotizaciones.some((c) => c.kommo_estado !== "enviado")) {
    try {
      defs = await cargarDefiniciones();
    } catch (error) {
      avisosBase.push(`No se pudieron leer los campos de Kommo: ${(error instanceof Error ? error.message : String(error)).slice(0, 200)}`);
    }
  }
  const resultados = [];
  for (const c of cotizaciones) resultados.push(await procesar(c, defs, avisosBase));

  return Response.json({ procesadas: resultados.length, resultados });
});