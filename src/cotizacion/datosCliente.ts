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
  { nombre: string; largo: number; ejemplo: string; soloNumeros: boolean; ayuda: string }
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

export const formatearCelular = (texto: string)

// orden en pantalla
export const ORDEN: Campo[] = ["nombre", "celular", "documento", "correo", "acepta"];

export function validar(d: DatosCliente): Errores {
  const e: Errores = {};
  const documento = d.documento.trim();
  const correo = d.correo.trim();

  if (d.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";

  if (!/^9\d{8}$/.test(soloDigitos(d.celular)))
    e.celular = "Escribe un celular de 9 dígitos que empiece con 9.";
  
  if (d.tipoDocumento === "dni" && !/^\d{8}$/.test(documento))
    e.documento = "El DNI tiene 8 dígitos.";
  if (d.tipoDocumento === "ruc" && !/^(10|15|16|17|20)\d{9}$/.test(documento))
    e.documento = "El RUC tiene 11 dígitos y empieza con 10 o 20.";
  if (d.tipoDocumento === "ce" && !/^[A-Z0-9]{8,12}$/i.test(documento))
    e.documento = "El carné tiene entre 8 y 12 letras o números.";

  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
    e.correo = "Revisa el correo, por ejemplo: nombre@gmail.com.";

  if (!d.acepta) e.acepta = "Marca la casilla para continuar.";

  return e;
}