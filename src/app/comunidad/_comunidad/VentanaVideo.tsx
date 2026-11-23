"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  WhatsappLogoIcon,
  XIcon,
} from "@phosphor-icons/react/ssr";
import {
  enlaceCompartirWhatsApp,
  etiquetaMotor,
  motorDe,
  urlReproductor,
  urlVideoTikTok,
  type Video,
} from "@/comunidad/videos";
import { rutaDe } from "@/contenido/motores";

type PropsVentanaVideo = {
  video: Video;
  posicion: number; // 1, 2, 3…
  total: number;
  alCerrar: () => void;
  alIr: (paso: -1 | 1) => void;
};

const BOTON_SECUNDARIO = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-[1.5px] border-guirose-accion px-5 text-base font-semibold text-guirose-accion transition-colors duration-150 hover:bg-guirose-espuma disabled:pointer-events-none disabled:opacity-40";

export default function VentanaVideo({
  video,
  posicion,
  total,
  alCerrar,
  alIr,
}: PropsVentanaVideo) {
  const ref = useRef<HTMLDialogElement>(null);
  const motor = motorDe(video);

  // Abre la ventana al aparecer, bloquea el scroll de la página de atrás y lo devuelve al cerrar
  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    dialogo.showModal();
    const antes = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = antes;
      if (dialogo.open) dialogo.close();
    };
  }, []);

  function alTeclear(e: React.KeyboardEvent<HTMLDialogElement>) {
    if (e.key === "ArrowLeft" && posicion > 1) alIr(-1);
    if (e.key === "ArrowRight" && posicion < total) alIr(1);
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-video"
      // "close" también se dispara al desmontar; solo cuenta si quedó cerrado
      onClose={() => {
        if (!ref.current?.open) alCerrar();
      }}
      onKeyDown={alTeclear}
      onClick={(e) => {
        if (e.target === ref.current) alCerrar();
      }}
      className="m-auto h-dvh max-h-none w-screen max-w-none overflow-y-auto bg-white p-0 opacity-0 transition-opacity duration-200 backdrop:bg-guirose-marino/80 open:opacity-100 starting:open:opacity-0 motion-reduce:transition-none lg:h-auto lg:max-h-[94dvh] lg:w-[min(940px,94vw)] lg:rounded-3xl"
    >
      <div className="relative grid gap-6 p-4 pb-8 lg:grid-cols-[auto_1fr] lg:gap-8 lg:p-6">
        <button
          type="button"
          onClick={alCerrar}
          aria-label="Cerrar video"
          className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-guirose-espuma text-guirose-marino transition-colors duration-150 hover:bg-guirose-espuma-fuerte lg:right-4 lg:top-4"
        >
          <XIcon size={20} weight="bold" aria-hidden="true" />
        </button>

        {/* Reproductor oficial de TikTok (vertical 9:16). La tapa se ve mientras carga. 
          Como la ventana solo existe después de tocar ▶ en la tarjeta, el reproductor no pesa en la carga de la página. */}
        <div className="relative mx-auto mt-12 aspect-[9/16] h-[min(70dvh,676px)] overflow-hidden rounded-2xl bg-guirose-marino lg:mt-0">
          {video.tapaUrl && (
            <Image
              src={video.tapaUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          )}
          <iframe
            key={video.id}
            src={`${urlReproductor(video)}&autoplay=1`}
            title={`Video: ${video.titulo}`}
            allow="autoplay; fullscreen; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 size-full border-0"
          />
        </div>

        <div className="flex min-w-0 flex-col lg:pr-10 lg:pt-1">
          <p className="text-sm font-semibold text-guirose-accion">
            {video.tipo === "entrega" ? "Entrega" : "Consejo"}
            <span className="font-normal text-guirose-texto">
              {" "}
              · {posicion} de {total}
            </span>
          </p>
          <h2
            id="titulo-video"
            className="mt-2 text-xl font-bold leading-snug text-guirose-marino lg:text-2xl"
          >
            {video.titulo}
          </h2>
          {video.motor && (
            <p className="mt-3 w-fit rounded-full bg-guirose-espuma px-3 py-1 text-sm font-medium text-guirose-accion">
              {etiquetaMotor(video)}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch">
            {motor && (
              <Link
                href={rutaDe(motor)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-guirose-accion px-5 text-base font-semibold text-white transition-colors duration-150 hover:bg-guirose-marino active:scale-[0.97]"
              >
                Ver motor {motor.hp} HP
                <ArrowRightIcon size={18} weight="bold" aria-hidden="true" />
              </Link>
            )}
            <a
              href={enlaceCompartirWhatsApp(video)}
              target="_blank"
              rel="noopener noreferrer"
              className={BOTON_SECUNDARIO}
            >
              <WhatsappLogoIcon size={20} weight="fill" aria-hidden="true" />
              Compartir por WhatsApp
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
          </div>

          <div className="mt-6 flex gap-3 lg:mt-auto lg:pt-8">
            <button
              type="button"
              onClick={() => alIr(-1)}
              disabled={posicion <= 1}
              className={`${BOTON_SECUNDARIO} flex-1`}
            >
              <CaretLeftIcon size={18} weight="bold" aria-hidden="true" />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => alIr(1)}
              disabled={posicion >= total}
              className={`${BOTON_SECUNDARIO} flex-1`}
            >
              Siguiente
              <CaretRightIcon size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          <a
            href={urlVideoTikTok(video)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 w-fit items-center text-sm font-medium text-guirose-texto underline-offset-4 hover:underline"
          >
            Ver en TikTok
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
