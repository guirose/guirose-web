import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  buscarMotor,
  rutaDe,
  type Motor,
  type TipoMotor,
} from "@/contenido/motores";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const CLAVE_PUBLICABLE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
const ESPERA_MAXIMA_MS = 8000;

let cliente: SupabaseClient | null = null;

function obtenerCliente(): SupabaseClient | null {
  if (!URL_SUPABASE || !CLAVE_PUBLICABLE) return null;
  cliente ??= createClient(URL_SUPABASE, CLAVE_PUBLICABLE, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return cliente;
}

export type TipoVideo = "entrega" | "consejo";
export type FiltroVideo = "todos" | TipoVideo;

export type Video = {
  id: string;
  titulo: string;
  tipo: TipoVideo;
  motor: string | null;
  lugar: string | null;
  orden: number;
  tiktokId: string;
  tapaUrl: string | null;
  duracion: number | null; // segundos
  creadoEn: string;
};

export type ResultadoVideos =
  | { estado: "ok"; videos: Video[] }
  | { estado: "sin-configurar" | "fallo"; videos: [] };

const COLUMNAS =
  "id,titulo,tipo,motor,lugar,orden,tiktok_id,tapa_url,duracion,creado_en";

export function aVideo(fila: unknown): Video | null {
  if (typeof fila !== "object" || fila === null) return null;
  const f = fila as Record<string, unknown>;

  const texto = (v: unknown): string | null =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : null;

  const id = texto(f.id);
  const titulo = texto(f.titulo);
  const tiktokId = texto(f.tiktok_id);
  const tipo = f.tipo === "entrega" || f.tipo === "consejo" ? f.tipo : null;
  const tapa = texto(f.tapa_url);

  if (!id || !titulo || !tipo || !tiktokId || !/^\d{8,25}$/.test(tiktokId))
    return null;

  return {
    id,
    titulo,
    tipo,
    motor: texto(f.motor),
    lugar: texto(f.lugar),
    orden: typeof f.orden === "number" ? f.orden : 100,
    tiktokId,
    // solo se aceptan tapas con https
    tapaUrl: tapa && tapa.startsWith("https://") ? tapa : null,
    duracion:
      typeof f.duracion === "number" && f.duracion >= 0 ? f.duracion : null,
    creadoEn: texto(f.creado_en) ?? "",
  };
}

export async function leerVideos(): Promise<ResultadoVideos> {
  const supabase = obtenerCliente();
  if (!supabase) return { estado: "sin-configurar", videos: [] };

  const consulta = supabase
    .from("videos")
    .select(COLUMNAS)
    .order("orden", { ascending: true })
    .order("fecha_tiktok", { ascending: false, nullsFirst: false });  
    const limite = new Promise<"tiempo">((resolver) =>
    setTimeout(() => resolver("tiempo"), ESPERA_MAXIMA_MS),
  );

  try {
    const respuesta = await Promise.race([consulta, limite]);
    if (respuesta === "tiempo") return { estado: "fallo", videos: [] };
    if (respuesta.error) {
      console.error("No se pudieron leer los videos:", respuesta.error.message);
      return { estado: "fallo", videos: [] };
    }
    const videos = (respuesta.data ?? [])
      .map(aVideo)
      .filter((v): v is Video => v !== null);
    return { estado: "ok", videos };
  } catch (error) {
    console.error("No se pudieron leer los videos:", error);
    return { estado: "fallo", videos: [] };
  }
}

export function filtrar(videos: Video[], filtro: FiltroVideo): Video[] {
  return filtro === "todos" ? videos : videos.filter((v) => v.tipo === filtro);
}

export function contar(videos: Video[]): Record<FiltroVideo, number> {
  return {
    todos: videos.length,
    entrega: videos.filter((v) => v.tipo === "entrega").length,
    consejo: videos.filter((v) => v.tipo === "consejo").length,
  };
}

function partesMotor(texto: string): { tipo: TipoMotor; hp: number } | null {
  const m = /^([24]) tiempos (\d{2,3}) HP$/.exec(texto);
  if (!m) return null;
  return { tipo: m[1] === "2" ? "2-tiempos" : "4-tiempos", hp: Number(m[2]) };
}

// el motor del catalogo al que apunta el video
export function motorDe(video: Video): Motor | undefined {
  if (!video.motor) return undefined;
  const p = partesMotor(video.motor);
  return p ? buscarMotor(p.tipo, `${p.hp}-hp`) : undefined;
}

// direccion de la ficha del motor, sin el prefijo del sitio
export function rutaMotorDe(video: Video): string | undefined {
  const motor = motorDe(video);
  return motor ? rutaDe(motor) : undefined;
}

export function etiquetaMotor(video: Video): string {
  if (!video.motor)
    return video.tipo === "consejo" ? "Consejo" : "Motor Mercury";
  const p = partesMotor(video.motor);
  return p
    ? `${p.hp} HP - ${p.tipo === "2-tiempos" ? "2 tiempos" : "4 tiempos"}`
    : video.motor;
}

export function duracionTexto(segundos: number | null): string {
  if (segundos === null) return "";
  const m = Math.floor(segundos / 60);
  const s = Math.floor(segundos % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// reporductor oficial de TikTok
export function urlReproductor(video: Video): string {
  return `https://www.tiktok.com/player/v1/${video.tiktokId}?rel=0&description=0&music_info=0&closed_caption=1`;
}

export function urlVideoTikTok(video: Video): string {
  return `https://www.tiktok.com/@guirose_pe/video/${video.tiktokId}`;
}

export function enlaceCompartirWhatsApp(video: Video): string {
  const texto = `${video.titulo} - GUIROSE\n${urlVideoTikTok(video)}`;
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}