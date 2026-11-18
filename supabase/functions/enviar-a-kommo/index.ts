type Seleccion = {
  medidas?: Record<string, string>;
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
  kommo_estado: "pendiente" | "procesando" | "enviado" | "error";
  kommo_intentos: number;
};

const MAX_INTENTOS = 5;
const ETIQUETA = "web-cotizador";
const EMBUDO = "COMERCIAL | MOTORES";
const ETAPA = "";
const MARCA = "Mercury";
const CREAR_TAREA = true;
const PLAZO_TAREA_MINUTOS = 60;
const TIPO_TAREA = 1;
const NOMBRE_DOCUMENTO = {
  dni: "DNI",
  ruc: "RUC",
  ce: "Carné de extranjería",
} as const;

const env = (nombre: string): string => {
  const valor = Deno.env.get(nombre);
  if (!valor) throw new Error(`Falta el secreto ${nombre}`);
  return valor;
};

const mensajeDe = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

// Supabase con clave secreta que existe ne el servidor
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

const leerCotizacion = async (id: string): Promise<Cotizacion | undefined> =>
  (await (await supabase(`cotizaciones?id=eq.${id}&select=*`)).json())[0];

const leerPendientes = async (): Promise<Cotizacion[]> =>
  (
    await supabase(
      `cotizaciones?kommo_estado=neq.enviado&kommo_intentos=lt.${MAX_INTENTOS}&order=creada_en.asc&limit=10&select=*`,
    )
  ).json();

const actualizar = (id: string, cambios: Record<string, unknown>) =>
  supabase(`cotizaciones?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(cambios),
  });

const reservar = async (id: string): Promise<boolean> =>
  (await (
    await supabase("rpc/reservar_cotizacion", {
      method: "POST",
      body: JSON.stringify({ p_id: id }),
    })
  ).json()) === true;

// Kommo
class ErrorKommo extends Error {
  estado: number;
  cuerpo: string;
  constructor(estado: number, cuerpo: string, ruta: string) {
    super(`Kommo ${estado} en ${ruta}: ${cuerpo.slice(0, 300)}`);
    this.estado = estado;
    this.cuerpo = cuerpo;
  }
}

async function kommo(
  ruta: string,
  opciones: RequestInit = {},
): Promise<Response> {
  const r = await fetch(
    `https://${env("KOMMO_SUBDOMINIO")}.kommo.com/api/v4${ruta}`,
    {
      ...opciones,
      headers: {
        Authorization: `Bearer ${env("KOMMO_TOKEN")}`,
        "Content-Type": "application/json",
        ...(opciones.headers as Record<string, string>),
      },
    },
  );
  if (!r.ok) throw new ErrorKommo(r.status, await r.text(), ruta);
  return r;
}

const soloDigitos = (t: string) => t.replace(/\D/g, "");

// formato que llega a kommo +51 999 999 999
const formatoKommo = (celular: string) =>
  `+51 ${celular.replace(/(\d{3})(?=\d)/g, "$1 ")}`;

type ValorSistema = { value: string; enum_code?: string };
type ContactoKommo = { id: number; correos: ValorSistema[]; leads: number[] };

// busca contacto
async function buscarContacto(
  celular: string,
): Promise<ContactoKommo | undefined> {
  for (const consulta of [celular, formatoKommo(celular)]) {
    const contacto = await buscarPor(consulta, celular);
    if (contacto) return contacto;
  }
  return undefined;
}

async function buscarPor(
  consulta: string,
  celular: string,
): Promise<ContactoKommo | undefined> {
  const r = await kommo(
    `/contacts?query=${encodeURIComponent(consulta)}&with=leads&limit=10`,
  );
  if (r.status === 204) return undefined;
  const contactos: {
    id: number;
    custom_fields_values?:
      | { field_code?: string; values: ValorSistema[] }[]
      | null;
    _embedded?: { leads?: { id: number }[] };
  }[] = (await r.json())?._embedded?.contacts ?? [];
  const deTipo = (c: (typeof contactos)[number], codigo: string) =>
    (c.custom_fields_values ?? [])
      .filter((f) => f.field_code === codigo)
      .flatMap((f) => f.values);
  const coincide = contactos.find((c) =>
    deTipo(c, "PHONE").some((v) => soloDigitos(v.value).endsWith(celular)),
  );
  if (!coincide) return undefined;
  return {
    id: coincide.id,
    correos: deTipo(coincide, "EMAIL"),
    leads: (coincide._embedded?.leads ?? []).map((l) => l.id),
  };
}

type Destino = {
  pipeline_id: number;
  status_id: number;
  abiertas: Set<number>;
};

async function destino(): Promise<Destino> {
  const datos = await (await kommo("/leads/pipelines")).json();
  const embudos: {
    id: number;
    name: string;
    _embedded: {
      statuses: { id: number; name: string; sort: number; type: number }[];
    };
  }[] = datos?._embedded?.pipelines ?? [];
  const embudo = embudos.find((e) => e.name.trim() === EMBUDO);
  if (!embudo) throw new Error(`No existe el embudo "${EMBUDO}" en Kommo`);
  // type 0 = etapa normal (type 1 = Leads entrantes)
  // 142 = ganado, 143 = perdido
  const etapas = embudo._embedded.statuses.filter(
    (s) => s.type === 0 && s.id !== 142 && s.id !== 143,
  );
  const etapa = ETAPA
    ? etapas.find((s) => s.name.trim() === ETAPA)
    : [...etapas].sort((a, b) => a.sort - b.sort)[0];
  if (!etapa)
    throw new Error(`No existe la etapa "${ETAPA}" en el embudo "${EMBUDO}"`);
  return {
    pipeline_id: embudo.id,
    status_id: etapa.id,
    abiertas: new Set(etapas.map((s) => s.id)),
  };
}

type CampoConValor = { field_id: number; values: { value?: unknown }[] };
type LeadKommo = {
  id: number;
  pipeline_id: number;
  status_id: number;
  updated_at: number;
  responsible_user_id?: number;
  custom_fields_values?: CampoConValor[] | null;
};

async function leadAbierto(
  contacto: ContactoKommo,
  d: Destino,
): Promise<LeadKommo | undefined> {
  if (!contacto.leads.length) return undefined;
  const filtro = contacto.leads
    .slice(0, 50)
    .map((id) => `filter[id][]=${id}`)
    .join("&");
  const r = await kommo(`/leads?${filtro}&limit=50`);
  if (r.status === 204) return undefined;
  const leads: LeadKommo[] = (await r.json())?._embedded?.leads ?? [];
  return leads
    .filter(
      (l) => l.pipeline_id === d.pipeline_id && d.abiertas.has(l.status_id),
    )
    .sort((a, b) => b.updated_at - a.updated_at)[0];
}

// Campos personalizados de Kommo
type OpcionKommo = { id: number; value: string };
type CampoKommo = {
  id: number;
  name: string;
  type: string;
  enums?: OpcionKommo[] | null;
};
type Definiciones = { leads: CampoKommo[]; contactos: CampoKommo[] };
type Valor = string | number | boolean | Date;
type Especificacion = {
  etiqueta: string;
  nombres: string[];
  valor: Valor | null | undefined;
  opciones?: string[];
};
type Entrada = {
  etiqueta: string;
  dato: { field_id: number; values: Record<string, unknown>[] };
};

const datos = (entradas: Entrada[]) => entradas.map((e) => e.dato);

const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

async function leerCampos(
  entidad: "leads" | "contacts",
): Promise<CampoKommo[]> {
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
  const [leads, contactos] = await Promise.all([
    leerCampos("leads"),
    leerCampos("contacts"),
  ]);
  return { leads, contactos };
}

function buscarCampo(
  campos: CampoKommo[],
  nombres: string[],
): CampoKommo | undefined {
  const utiles = campos.filter((c) => !normalizar(c.name).includes("legado"));
  const buscados = nombres.map(normalizar);
  for (const b of buscados) {
    const exacto = utiles.find((c) => normalizar(c.name) === b);
    if (exacto) return exacto;
  }
  for (const b of buscados) {
    const coinciden = utiles.filter((c) => normalizar(c.name).includes(b));
    const elegido =
      coinciden.find((c) =>
        normalizar(c.name).includes("objetivo principal"),
      ) ??
      coinciden.find((c) => normalizar(c.name).includes("objetivo")) ??
      coinciden[0];
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
function entradaDe(campo: CampoKommo, esp: Especificacion): Entrada | string {
  const valor = esp.valor as Valor;
  const entrada = (values: Record<string, unknown>[]): Entrada => ({
    etiqueta: esp.etiqueta,
    dato: { field_id: campo.id, values },
  });
  switch (campo.type) {
    case "select":
    case "radiobutton":
    case "multiselect": {
      const enumId = buscarOpcion(campo, esp.opciones ?? [String(valor)]);
      return enumId
        ? entrada([{ enum_id: enumId }])
        : "no existe esa opción en la lista";
    }
    case "numeric": {
      const n = Number(valor);
      return Number.isFinite(n) ? entrada([{ value: n }]) : "valor no numérico";
    }
    case "checkbox":
      return entrada([{ value: Boolean(valor) }]);
    case "date":
    case "date_time": {
      const f = valor instanceof Date ? valor : new Date(String(valor));
      return Number.isNaN(f.getTime())
        ? "fecha no válida"
        : entrada([{ value: Math.floor(f.getTime() / 1000) }]);
    }
    default: {
      // texto, párrafo, url…
      const texto =
        valor instanceof Date
          ? valor.toISOString().slice(0, 10)
          : String(valor);
      return entrada([
        { value: texto.slice(0, campo.type === "text" ? 250 : 2000) },
      ]);
    }
  }
}

function construirCampos(
  campos: CampoKommo[] | undefined,
  especificaciones: Especificacion[],
): { valores: Entrada[]; faltan: string[] } {
  const valores: Entrada[] = [];
  const faltan: string[] = [];
  for (const esp of especificaciones) {
    if (esp.valor === null || esp.valor === undefined || esp.valor === "")
      continue;
    const campo = campos ? buscarCampo(campos, esp.nombres) : undefined;
    if (!campo) {
      faltan.push(`${esp.etiqueta} (no se encontró el campo)`);
      continue;
    }
    const resultado = entradaDe(campo, esp);
    if (typeof resultado === "string")
      faltan.push(`${esp.etiqueta} (${resultado})`);
    else valores.push(resultado);
  }
  return { valores, faltan };
}

const valoresDe = (lead: LeadKommo, campo: CampoKommo | undefined): string[] =>
  campo
    ? (lead.custom_fields_values ?? [])
        .filter((f) => f.field_id === campo.id)
        .flatMap((f) => f.values.map((v) => String(v.value ?? "")))
        .filter(Boolean)
    : [];

// Dato que va en cada campo
const NOMBRES_POTENCIA = [
  "potencia objetivo principal hp",
  "potencia objetivo principal",
  "potencia objetivo",
];
const NOMBRES_ALTERNATIVAS = [
  "potencias alternativas evaluadas",
  "potencias alternativas",
];

const pies = (clave: string | undefined): number | undefined => {
  const m = clave?.match(/(\d+)ft/);
  return m ? Number(m[1]) : undefined;
};

// 115EXLPT → 115 HP, cola XL = 25", L = 20", sin L = 15"; con H = mando popero
function datosDelModelo(modelo: string) {
  const m = modelo.toUpperCase().match(/^(\d+)([A-Z]*)$/);
  const hp = m ? Number(m[1]) : undefined;
  const letras = m?.[2] ?? "";
  const cola = letras.includes("XL") ? 25 : letras.includes("L") ? 20 : 15;
  const control = letras.includes("H") ? "Mando popero" : "Control remoto";
  return { hp, cola, control };
}

// arnés = interruptor con llave (30 o 40 pies) + extensiones × cantidad
function largoArnes(s: Seleccion | null): number | undefined {
  const base = pies(s?.medidas?.llave);
  if (base === undefined) return undefined;
  const extra = Object.entries(s?.extensiones ?? {}).reduce(
    (t, [clave, cantidad]) => t + (pies(clave) ?? 0) * cantidad,
    0,
  );
  return base + extra;
}

// si el lead ya tenía otra potencia, pasa a "Potencias alternativas evaluadas"
function alternativasDe(
  lead: LeadKommo,
  campos: CampoKommo[],
  hpNuevo: number | undefined,
): string | undefined {
  const anteriores = valoresDe(lead, buscarCampo(campos, NOMBRES_POTENCIA));
  const existentes = valoresDe(lead, buscarCampo(campos, NOMBRES_ALTERNATIVAS))
    .flatMap((t) => t.split(/[,;]/))
    .map((t) => t.trim())
    .filter(Boolean);
  const lista = [
    ...existentes,
    ...anteriores.map((v) => `${soloDigitos(v)} HP`),
  ];
  const sinRepetir = [...new Set(lista)].filter((t) => t !== `${hpNuevo} HP`);
  return sinRepetir.length ? sinRepetir.join(", ") : undefined;
}

function camposDelContacto(c: Cotizacion): Especificacion[] {
  const tipo = c.tipo_documento;
  return [
    {
      etiqueta: "Tipo de documento",
      nombres: ["tipo de documento"],
      valor: NOMBRE_DOCUMENTO[tipo],
      // por ahora RUC se clasifica como "Otro" en Kommo
      opciones: tipo === "ce" ? ["Carné de extranjería"]: tipo === "dni" ? ["DNI"]: ["RUC", "Otro"]
    },
    {
      etiqueta: "Número de documento",
      nombres: ["numero de documento", "numero documento"],
      valor: c.documento,
    },
    {
      etiqueta: "Términos y condiciones",
      nombres: ["terminos y condiciones", "terminos"],
      valor: true,
      opciones: ["Sí", "Si", "Acepta", "Aceptado", "Acepto"],
    },
  ];
}

function camposDelLead(c: Cotizacion, alternativas?: string): Especificacion[] {
  const { hp, cola, control } = datosDelModelo(c.modelo);
  const dosTiempos = c.tipo_motor.startsWith("2");
  const ciclo = dosTiempos ? "2 tiempos" : "4 tiempos";
  return [
    {
      etiqueta: "Fuente / Origen",
      nombres: ["fuente origen del lead", "fuente"],
      valor: "Web",
      opciones: ["Web"],
    },
    {
      etiqueta: "Medio de contacto",
      nombres: ["medio de contacto"],
      valor: "WhatsApp",
      opciones: ["WhatsApp"],
    },
    {
      etiqueta: "Marca",
      nombres: ["marca objetivo principal", "marca objetivo"],
      valor: MARCA,
    },
    {
      etiqueta: "Ciclo",
      nombres: ["ciclo objetivo principal", "ciclo objetivo"],
      valor: ciclo,
      opciones: [ciclo],
    },
    {
      etiqueta: "Sistema de control",
      nombres: [
        "sistema de control objetivo principal",
        "sistema de control objetivo",
      ],
      valor: control,
      // pesca artesanal: popero o remoto mecánico
      opciones: control === "Mando popero" ? ["Popero"] : ["Remoto mecánico"],
    },
    {
      etiqueta: "Configuración del control",
      nombres: [
        "configuracion del control objetivo principal",
        "configuracion del control objetivo",
      ],
      valor: control === "Mando popero" ? null : "Consola simple",
      opciones: ["Consola simple"],
    },
    { etiqueta: "Potencia (HP)", nombres: NOMBRES_POTENCIA, valor: hp },
    {
      etiqueta: "Potencias alternativas",
      nombres: NOMBRES_ALTERNATIVAS,
      valor: alternativas,
    },
    {
      etiqueta: "Longitud de transmisión (pulg)",
      nombres: ["longitud transmision oem objetivo", "longitud transmision"],
      valor: cola,
    },
    {
      etiqueta: "Longitud de cables (pies)",
      nombres: ["longitud cables aceleracion cambios", "longitud cables"],
      valor: pies(c.seleccion?.medidas?.cable),
    },
    {
      etiqueta: "Longitud de arnés (pies)",
      nombres: ["longitud arnes electrico", "longitud arnes"],
      valor: largoArnes(c.seleccion),
    },
    {
      etiqueta: "Fecha de última cotización",
      nombres: ["fecha de ultima cotizacion"],
      valor: new Date(),
    },
    { etiqueta: "Comentario", nombres: ["comentario"], valor: c.comentario },
  ];
}

// codigo, nombre, nota, tarea
type Modo = "nuevo" | "actualizado" | "avanzado";

const codigoDe = (id: string) => `GR-${id.slice(0, 6).toUpperCase()}`;

const nombreLead = (c: Cotizacion) =>
  `${c.nombre.toUpperCase()} - ${c.modelo} · ${codigoDe(c.id)}`;

const venceEn = (minutos: number) =>
  Math.floor(Date.now() / 1000) + minutos * 60;

function textoNota(c: Cotizacion, modo: Modo, avisos: string[]): string {
  const titulo = {
    nuevo: `Cotización web ${codigoDe(c.id)}`,
    actualizado: `Nueva cotización web ${codigoDe(c.id)} (se actualizaron los campos del lead)`,
    avanzado: `Nueva cotización web ${codigoDe(c.id)} (el lead ya estaba en otra etapa: no se cambiaron sus campos)`,
  }[modo];
  return [
    titulo,
    `Motor: ${c.tipo_motor} ${c.modelo}`,
    `${NOMBRE_DOCUMENTO[c.tipo_documento]}: ${c.documento}`,
    c.correo ? `Correo: ${c.correo}` : null,
    c.comentario ? `Comentario del cliente: ${c.comentario}` : null,
    "",
    "Mensaje preparado para WhatsApp:",
    c.mensaje,
    avisos.length
      ? `\nCampos de Kommo sin rellenar (revisar nombres u opciones):\n- ${avisos.join("\n- ")}`
      : null,
  ]
    .filter((linea) => linea !== null)
    .join("\n");
}

const textoTarea = (c: Cotizacion, modo: Modo) =>
  modo === "avanzado"
    ? `El cliente envió una nueva cotización web ${codigoDe(c.id)} (${c.modelo}). Revisar la nota.`
    : `Responder cotización web ${codigoDe(c.id)} (${c.modelo})`;

// envío seguro
function camposRechazados(cuerpo: string, principal: "lead" | "contacto") {
  const lead = new Set<number>();
  const contacto = new Set<number>();
  for (const m of cuerpo.matchAll(
    /(_embedded\.contacts\.\d+\.)?custom_fields_values\.(\d+)/g,
  )) {
    const posicion = Number(m[2]);
    if (m[1] || principal === "contacto") contacto.add(posicion);
    else lead.add(posicion);
  }
  return { lead, contacto };
}

async function enviarSeguro<T>(
  lead: Entrada[],
  contacto: Entrada[],
  principal: "lead" | "contacto",
  avisos: string[],
  enviar: (lead: Entrada[], contacto: Entrada[]) => Promise<T>,
): Promise<T> {
  let l = [...lead];
  let co = [...contacto];
  for (let intento = 0; intento < 3; intento++) {
    try {
      return await enviar(l, co);
    } catch (error) {
      if (!(error instanceof ErrorKommo) || error.estado !== 400) throw error;
      console.error("Kommo rechazó campos:", error.cuerpo);
      const r = camposRechazados(error.cuerpo, principal);
      const quitar = [...r.lead]
        .map((i) => l[i])
        .concat([...r.contacto].map((i) => co[i]))
        .filter(Boolean);
      if (quitar.length) {
        avisos.push(
          ...quitar.map((e) => `${e.etiqueta} (Kommo rechazó el valor)`),
        );
        l = l.filter((_, i) => !r.lead.has(i));
        co = co.filter((_, i) => !r.contacto.has(i));
      } else if (l.length || co.length) {
        avisos.push(
          `Kommo rechazó los campos y se envió sin ellos: ${error.cuerpo.slice(0, 200)}`,
        );
        l = [];
        co = [];
      } else {
        throw error;
      }
    }
  }
  return await enviar(l, co);
}

// crear o actualizar el lead
async function crearLead(
  c: Cotizacion,
  d: Destino,
  contacto: ContactoKommo | undefined,
  camposLead: Entrada[],
  camposContacto: Entrada[],
  avisos: string[],
): Promise<number> {
  return await enviarSeguro(
    camposLead,
    camposContacto,
    "lead",
    avisos,
    async (l, co) => {
      const lead = {
        name: nombreLead(c),
        pipeline_id: d.pipeline_id,
        status_id: d.status_id,
        custom_fields_values: datos(l),
      };
      const etiquetas = [{ name: ETIQUETA }];
      if (contacto) {
        // el cliente ya existe: el lead se une a su contacto
        const r = await kommo("/leads", {
          method: "POST",
          body: JSON.stringify([
            {
              ...lead,
              _embedded: { tags: etiquetas, contacts: [{ id: contacto.id }] },
            },
          ]),
        });
        return (await r.json())._embedded.leads[0].id;
      }
      // cliente nuevo: lead y contacto en una sola petición (los campos propios van primero)
      const delContacto: Record<string, unknown>[] = [
        ...datos(co),
        {
          field_code: "PHONE",
          values: [{ value: formatoKommo(c.celular), enum_code: "MOB" }],
        },
      ];
      if (c.correo)
        delContacto.push({
          field_code: "EMAIL",
          values: [{ value: c.correo, enum_code: "WORK" }],
        });
      const r = await kommo("/leads/complex", {
        method: "POST",
        body: JSON.stringify([
          {
            ...lead,
            _embedded: {
              tags: etiquetas,
              contacts: [{ name: c.nombre, custom_fields_values: delContacto }],
            },
          },
        ]),
      });
      return (await r.json())[0].id;
    },
  );
}

async function actualizarLead(
  c: Cotizacion,
  lead: LeadKommo,
  campos: Entrada[],
  avisos: string[],
): Promise<void> {
  await enviarSeguro(campos, [], "lead", avisos, (l) =>
    kommo("/leads", {
      method: "PATCH",
      body: JSON.stringify([
        { id: lead.id, name: nombreLead(c), custom_fields_values: datos(l) },
      ]),
    }),
  );
}

// a un contacto que ya existía: documento, términos y el correo si no lo tenía
async function completarContacto(
  c: Cotizacion,
  contacto: ContactoKommo,
  campos: Entrada[],
  avisos: string[],
) {
  const correoNuevo =
    !!c.correo &&
    !contacto.correos.some(
      (v) => v.value.trim().toLowerCase() === c.correo!.trim().toLowerCase(),
    );
  if (!campos.length && !correoNuevo) return;
  try {
    await enviarSeguro([], campos, "contacto", avisos, (_, co) => {
      const cambios: Record<string, unknown>[] = [...datos(co)];
      if (correoNuevo) {
        // Kommo reemplaza la lista: se envían los correos anteriores más el nuevo
        cambios.push({
          field_code: "EMAIL",
          values: [...contacto.correos, { value: c.correo, enum_code: "WORK" }],
        });
      }
      return kommo("/contacts", {
        method: "PATCH",
        body: JSON.stringify([
          { id: contacto.id, custom_fields_values: cambios },
        ]),
      });
    });
  } catch (error) {
    avisos.push(
      `No se pudo actualizar el contacto: ${mensajeDe(error).slice(0, 200)}`,
    );
  }
}

async function tieneTareaWeb(leadId: number): Promise<boolean> {
  const r = await kommo(
    `/tasks?filter[entity_type]=leads&filter[entity_id][]=${leadId}&filter[is_completed]=0`,
  );
  if (r.status === 204) return false;
  const tareas: { text?: string }[] = (await r.json())?._embedded?.tasks ?? [];
  return tareas.some((t) =>
    normalizar(t.text ?? "").includes("cotizacion web"),
  );
}

async function crearTarea(
  c: Cotizacion,
  leadId: number,
  modo: Modo,
  responsable: number | undefined,
  avisos: string[],
) {
  if (!CREAR_TAREA) return;
  try {
    if (modo === "actualizado" && (await tieneTareaWeb(leadId))) return;
    await kommo("/tasks", {
      method: "POST",
      body: JSON.stringify([
        {
          text: textoTarea(c, modo),
          complete_till: venceEn(PLAZO_TAREA_MINUTOS),
          entity_id: leadId,
          entity_type: "leads",
          task_type_id: TIPO_TAREA,
          ...(responsable ? { responsible_user_id: responsable } : {}),
        },
      ]),
    });
  } catch (error) {
    avisos.push(`No se pudo crear la tarea: ${mensajeDe(error).slice(0, 200)}`);
  }
}

async function enviarCotizacion(
  c: Cotizacion,
  defs: Definiciones | undefined,
  avisos: string[],
): Promise<number> {
  const d = await destino();
  const contacto = await buscarContacto(c.celular);
  const abierto = contacto ? await leadAbierto(contacto, d) : undefined;
  const modo: Modo = !abierto
    ? "nuevo"
    : abierto.status_id === d.status_id
      ? "actualizado"
      : "avanzado";

  const delContacto = construirCampos(defs?.contactos, camposDelContacto(c));
  avisos.push(...delContacto.faltan);

  let leadId: number;
  if (modo === "avanzado") {
    leadId = abierto!.id;
  } else {
    const hp = datosDelModelo(c.modelo).hp;
    const alternativas =
      abierto && defs ? alternativasDe(abierto, defs.leads, hp) : undefined;
    const delLead = construirCampos(
      defs?.leads,
      camposDelLead(c, alternativas),
    );
    avisos.push(...delLead.faltan);
    if (abierto) {
      leadId = abierto.id;
      await actualizarLead(c, abierto, delLead.valores, avisos);
    } else {
      leadId = await crearLead(
        c,
        d,
        contacto,
        delLead.valores,
        contacto ? [] : delContacto.valores,
        avisos,
      );
    }
  }

  if (contacto)
    await completarContacto(c, contacto, delContacto.valores, avisos);
  await crearTarea(c, leadId, modo, abierto?.responsible_user_id, avisos);
  await kommo("/leads/notes", {
    method: "POST",
    body: JSON.stringify([
      {
        entity_id: leadId,
        note_type: "common",
        params: { text: textoNota(c, modo, avisos) },
      },
    ]),
  });
  return leadId;
}

// procesar cada cotizacion
async function procesar(
  c: Cotizacion,
  definiciones: () => Promise<Definiciones | undefined>,
  avisosBase: string[],
): Promise<string> {
  if (c.kommo_estado === "enviado") return `${c.id}: ya estaba enviada`;
  let turno: boolean;
  try {
    turno = await reservar(c.id);
  } catch (error) {
    // la fila sigue "pendiente" (se reintenta), pero queda escrito el motivo
    const motivo = `No se pudo pedir turno: ${mensajeDe(error)}`;
    console.error(`Cotización ${c.id}:`, motivo);
    await actualizar(c.id, { kommo_error: motivo.slice(0, 500) }).catch(() => {});
    return `${c.id}: error (${motivo.slice(0, 300)})`;
  }
  if (!turno)
    return `${c.id}: en espera (otra del mismo celular en proceso, o aún no toca reintentar)`;
  const defs = await definiciones();
  const avisos = [...avisosBase];
  try {
    const leadId = await enviarCotizacion(c, defs, avisos);
    await actualizar(c.id, {
      kommo_estado: "enviado",
      kommo_lead_id: leadId,
      kommo_enviado_en: new Date().toISOString(),
      kommo_intentos: c.kommo_intentos + 1,
      kommo_error: null,
    });
    return `${c.id}: enviada (lead ${leadId})${avisos.length ? ` | avisos: ${avisos.join("; ")}` : ""}`;
  } catch (error) {
    const motivo =
      error instanceof ErrorKommo
        ? `${error.message} | ${error.cuerpo.slice(0, 1000)}`
        : mensajeDe(error);
    console.error(`Cotización ${c.id} con error:`, motivo);
    await actualizar(c.id, {
      kommo_estado: "error",
      kommo_intentos: c.kommo_intentos + 1,
      kommo_error: motivo.slice(0, 500),
    });
    return `${c.id}: error (${motivo.slice(0, 300)})`;
  }
}

Deno.serve(async (req: Request) => {
  // solo el Database Webhook y pg_cron conocen este secreto
  if (req.headers.get("x-guirose-secreto") !== env("WEBHOOK_SECRETO")) {
    return new Response("No autorizado", { status: 401 });
  }

  try {
    return await atender(req);
  } catch (error) {
    // cualquier fallo inesperado queda en Logs y en la respuesta (net._http_response)
    console.error("Error general:", mensajeDe(error));
    return Response.json({ error: mensajeDe(error).slice(0, 500) }, { status: 500 });
  }
});

async function atender(req: Request): Promise<Response> {
  const cuerpo = await req.json().catch(() => ({}));
  const id: string | undefined = cuerpo?.record?.id;
  const cotizaciones = id
    ? ([await leerCotizacion(id)].filter(Boolean) as Cotizacion[])
    : await leerPendientes();

  // los campos de Kommo se leen una sola vez y solo si hay algo que enviar
  const avisosBase: string[] = [];
  let cargadas: Promise<Definiciones | undefined> | undefined;
  const definiciones = () =>
    (cargadas ??= cargarDefiniciones().catch((error) => {
      avisosBase.push(
        `No se pudieron leer los campos de Kommo: ${mensajeDe(error).slice(0, 200)}`,
      );
      return undefined;
    }));

  const resultados: string[] = [];
  for (const c of cotizaciones)
    resultados.push(await procesar(c, definiciones, avisosBase));

  if (resultados.length) console.log(JSON.stringify(resultados)); // se ve en la pestaña Logs
  return Response.json({ procesadas: resultados.length, resultados });
}