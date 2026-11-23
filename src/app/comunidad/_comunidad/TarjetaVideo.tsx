import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "@phosphor-icons/react/ssr";
import {
  duracionTexto,
  etiquetaMotor,
  motorDe,
  type TipoVideo,
  type Video,
} from "@/comunidad/videos";
import { rutaDe } from "@/contenido/motores";

type PropsTarjetaVideo = {
  video: Video;
  alAbrir: (video: Video) => void;
};

const ETIQUETA_TIPO: Record<TipoVideo, string> = {
  entrega: "Entrega",
  consejo: "Consejo",
};

const COLOR_TIPO: Record<TipoVideo, string> = {
  entrega: "bg-guirose-accion text-white",
  consejo: "bg-white text-guirose-marino",
};

export default function TarjetaVideo({ video, alAbrir }: PropsTarjetaVideo) {
  const motor = motorDe(video);
  const duracion = duracionTexto(video.duracion);

  return (
    <article className="flex h-full flex-col">
      {/* Toda la tapa es el botón de reproducir */}
      <button
        type="button"
        onClick={() => alAbrir(video)}
        aria-label={`Ver video: ${video.titulo}`}
        className="group relative block aspect-[256/374] w-full overflow-hidden rounded-2xl bg-guirose-marino transition-transform duration-150 ease-out active:scale-[0.98]"
      >
        {video.tapaUrl && (
          <Image
            src={video.tapaUrl}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold shadow-sm ${COLOR_TIPO[video.tipo]}`}
        >
          {ETIQUETA_TIPO[video.tipo]}
        </span>
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full bg-white/90 text-guirose-accion shadow-lg transition-transform duration-200 ease-out group-hover:scale-110">
            <PlayIcon size={28} weight="fill" aria-hidden="true" />
          </span>
        </span>
        {duracion && (
          <span className="absolute bottom-3 right-3 rounded-md bg-guirose-marino/80 px-2 py-0.5 text-sm font-medium text-white">
            {duracion}
          </span>
        )}
      </button>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-guirose-marino">
          {video.titulo}
        </h3>
        {video.motor && (
          <p className="mt-2 w-fit rounded-full bg-guirose-espuma px-3 py-1 text-sm font-medium text-guirose-accion">
            {etiquetaMotor(video)}
          </p>
        )}
        {motor && (
          <Link
            href={rutaDe(motor)}
            className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-2 text-base font-semibold text-guirose-accion hover:underline"
          >
            Ver motor {motor.hp} HP
            <ArrowRightIcon size={16} weight="bold" aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}
