import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { soloDigitos, type DatosCliente } from "./datosCliente";
import type { Seleccion } from "./seleccion";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const CLAVE_PUBLICABLE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const ESPERA_MAXIMA_MS = 8000;
const YA_EXISTE = "23505";

let cliente: SupabaseClient | null = null;

function obtenerCliente(): SupabaseClient | null {
  if (!URL_SUPABASE || !CLAVE_PUBLICABLE) return null;
  // por ahora no hay inicio sesión no hace falta guardar ni renovar sesiones
  cliente ??= createClient(URL_SUPABASE, CLAVE_PUBLICABLE, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cliente;
}

export type Registro = {
  id: string;
  datos: DatosCliente;
  seleccion: Seleccion;
  sinEquipamiento: boolean;
  mensaje: string;
};

export type Resultado = "guardada" | "sin-configurar" | "fallo";

export async function guardarCotizacion(r: Registro): Promise<Resultado> {
  const supabase = obtenerCliente();
  if (!supabase) return "sin-configurar";

  const documento = r.datos.documento.trim();
  const fila = {
    id: r.id,
    nombre: r.datos.nombre.trim(),
    celular: soloDigitos(r.datos.celular),
    tipo_documento: r.datos.tipoDocumento,
    documento: r.datos.tipoDocumento === "ce" ? documento.toUpperCase() : documento,
    correo: r.datos.correo.trim() || null,
    comentario: r.datos.comentario.trim() || null,
    acepta_privacidad: r.datos.acepta,
    tipo_motor: r.seleccion.tipo,
    modelo: r.seleccion.modelo,
    seleccion: r.seleccion,
    sin_equipamiento: r.sinEquipamiento,
    mensaje: r.mensaje,
  };

  const insertar = supabase.from("cotizaciones").insert(fila);
  const limite = new Promise<"tiempo">((resolver) =>
    setTimeout(() => resolver("tiempo"), ESPERA_MAXIMA_MS),
  );

  try {
    const respuesta = await Promise.race([insertar, limite]);
    if (respuesta === "tiempo") return "fallo";
    if (!respuesta.error || respuesta.error.code === YA_EXISTE) return "guardada";
    console.error("No se pudo guardar la cotización:", respuesta.error.message);
    return "fallo";
  } catch (error) {
    console.error("No se pudo guardar la cotización:", error);
    return "fallo";
  }
}