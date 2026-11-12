import emailSpellChecker from "@zootools/email-spell-checker";

// Datos que deja el cliente y reglas de validacion
export type TipoDocumento = "dni" | "ruc" | "ce";

export type DatosCliente = {
  nombre: string;
  celular: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  correo: string;
  comentario: string;
  acepta: boolean;
};

export type Campo = keyof DatosCliente;
export type Errores = Partial<Record<Campo, string>>;

export const DOCUMENTOS: Record<
  TipoDocumento,
  {
    nombre: string;
    largo: number;
    ejemplo: string;
    soloNumeros: boolean;
    ayuda: string;
  }
> = {
  dni: {
    nombre: "DNI",
    largo: 8,
    ejemplo: "8 dígitos",
    soloNumeros: true,
    ayuda: "Lo usamos solo para preparar tu cotización.",
  },
  ruc: {
    nombre: "RUC",
    largo: 11,
    ejemplo: "11 dígitos",
    soloNumeros: true,
    ayuda: "Elige RUC si necesitas factura a nombre de tu empresa.",
  },
  ce: {
    nombre: "Carné ext.",
    largo: 12,
    ejemplo: "Hasta 12 caracteres",
    soloNumeros: false,
    ayuda: "Para clientes extranjeros con carné de extranjería.",
  },
};

export const datosVacios: DatosCliente = {
  nombre: "",
  celular: "",
  tipoDocumento: "dni",
  documento: "",
  correo: "",
  comentario: "",
  acepta: false,
};

export const soloDigitos = (texto: string) => texto.replace(/\D/g, "");

export const formatearCelular = (texto: string) =>
  soloDigitos(texto)
    .slice(0, 9)
    .replace(/(\d{3})(?=\d)/g, "$1 ");

export function rucValido(ruc: string): boolean {
  if (!/^(10|15|16|17|20)\d{9}$/.test(ruc)) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce(
    (total, peso, i) => total + peso * Number(ruc[i]),
    0,
  );
  const resultado = 11 - (suma % 11);
  const digito = resultado === 10 ? 0 : resultado === 11 ? 1 : resultado;
  return digito === Number(ruc[10]);
}

// dominios de Perú
const DOMINIOS_PERU = [
  "pe",
  "com.pe",
  "edu.pe",
  "gob.pe",
  "org.pe",
  "net.pe",
  "nom.pe",
];

// Devuelve el correo corregido si el dominio parece un error de tipeo
export function sugerirCorreo(correo: string): string | undefined {
  const texto = correo.trim();
  if (!texto.includes("@")) return undefined;
  const sugerencia = emailSpellChecker.run({
    email: texto,
    topLevelDomains: [...emailSpellChecker.POPULAR_TLDS, ...DOMINIOS_PERU],
  });
  return sugerencia?.full;
}

// orden en pantalla
export const ORDEN: Campo[] = [
  "nombre",
  "celular",
  "documento",
  "correo",
  "acepta",
];

export function validar(d: DatosCliente): Errores {
  const e: Errores = {};
  const documento = d.documento.trim();
  const correo = d.correo.trim();

  if (d.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";

  if (!/^9\d{8}$/.test(soloDigitos(d.celular)))
    e.celular = "Escribe un celular de 9 dígitos que empiece con 9.";

  if (d.tipoDocumento === "dni") {
    if (!/^\d{8}$/.test(documento)) e.documento = "El DNI tiene 8 dígitos.";
    else if (/^(\d)\1{7}$/.test(documento))
      e.documento = "Revisa tu DNI: no puede tener todos los dígitos iguales.";
  }
  if (d.tipoDocumento === "ruc") {
    if (!/^(10|15|16|17|20)\d{9}$/.test(documento))
      e.documento = "El RUC tiene 11 dígitos y empieza con 10 o 20.";
    else if (!rucValido(documento))
      e.documento = "Revisa el RUC: tiene 11 dígitos y alguno no coincide.";
  }
  if (d.tipoDocumento === "ce" && !/^[A-Z0-9]{8,12}$/i.test(documento))
    e.documento = "El carné tiene entre 8 y 12 letras o números.";

  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    e.correo = "Revisa el correo, por ejemplo: nombre@gmail.com.";

  if (!d.acepta) e.acepta = "Marca la casilla para continuar.";

  return e;
}