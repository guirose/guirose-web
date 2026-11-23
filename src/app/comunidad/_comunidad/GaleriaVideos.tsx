"use client";

import { useEffect, useState } from "react";
import Aparecer from "@/ui/Aparecer";
import {
  contar,
  filtrar,
  leerVideos,
  type FiltroVideo,
  type ResultadoVideos,
} from "@/comunidad/videos";
import TarjetaVideo from "./TarjetaVideo";
import VentanaVideo from "./VentanaVideo";

const PERFIL_TIKTOK = "https://www.tiktok.com/@guirose_pe";

const FILTROS: { valor: FiltroVideo; texto: string }[] = [
  { valor: "todos", texto: "Todos" },
  { valor: "entrega", texto: "Entregas" },
  { valor: "consejo", texto: "Consejos" },
];

const CLASES_GRILLA = "grid max-w-[1120px] grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-6";

export default function GaleriaVideos() {
  // null = todavía cargando
  const [resultado, setResultado] = useState<ResultadoVideos | null>(null);
  const [filtro, setFiltro] = useState<FiltroVideo>("todos");
  // id del video que está abierto en la ventana
  const [abierto, setAbierto] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    leerVideos().then((r) => {
      if (!cancelado) setResultado(r);
    });
    return () => {
      cancelado = true;
    };
  }, []);

  if (resultado === null) {
    return (
      <div aria-busy="true">
        <p role="status" className="sr-only">
          Cargando videos…
        </p>
        <div className={CLASES_GRILLA}>
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="aspect-[256/374] animate-pulse rounded-2xl bg-guirose-espuma"
            />
          ))}
        </div>
      </div>
    );
  }

  if (resultado.estado !== "ok") {
    return (
      <div className="max-w-[1120px] rounded-2xl bg-guirose-espuma p-6 lg:p-8">
        <p className="text-lg font-semibold text-guirose-marino">
          No pudimos cargar los videos en este momento.
        </p>
        <p className="mt-2 text-base text-guirose-texto">
          Vuelve a intentarlo en unos minutos o míralos directamente en TikTok.
        </p>
        <a
          href={PERFIL_TIKTOK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center font-semibold text-guirose-accion hover:underline"
        >
          Ver @guirose_pe en TikTok
          <span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </div>
    );
  }

  const cantidades = contar(resultado.videos);
  const visibles = filtrar(resultado.videos, filtro);
  const indiceAbierto = visibles.findIndex((v) => v.id === abierto);

  if (cantidades.todos === 0) {
    return (
      <p className="max-w-[1120px] text-lg text-guirose-texto">
        Pronto publicaremos las historias de nuestros clientes.
      </p>
    );
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Filtrar videos"
        className="mb-8 flex max-w-[1120px] flex-wrap gap-3"
      >
        {FILTROS.map(({ valor, texto }) => {
          const activo = filtro === valor;
          return (
            <button
              key={valor}
              type="button"
              aria-pressed={activo}
              onClick={() => setFiltro(valor)}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-base font-semibold transition-colors duration-150 ${
                activo
                  ? "bg-guirose-accion text-white"
                  : "bg-guirose-espuma text-guirose-marino hover:bg-guirose-espuma-fuerte"
              }`}
            >
              {texto}
              <span
                className={`text-sm ${activo ? "opacity-90" : "opacity-70"}`}
              >
                {cantidades[valor]}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visibles.length} {visibles.length === 1 ? "video" : "videos"}
      </p>

      {visibles.length === 0 ? (
        <p className="max-w-[1120px] text-lg text-guirose-texto">
          Aún no hay videos de este tipo.
        </p>
      ) : (
        <div className={CLASES_GRILLA}>
          {visibles.map((video, i) => (
            <Aparecer key={video.id} retraso={(i % 3) * 100} className="h-full">
              <TarjetaVideo video={video} alAbrir={(v) => setAbierto(v.id)} />
            </Aparecer>
          ))}
        </div>
      )}

      {indiceAbierto >= 0 && (
        <VentanaVideo
          video={visibles[indiceAbierto]}
          posicion={indiceAbierto + 1}
          total={visibles.length}
          alCerrar={() => setAbierto(null)}
          alIr={(paso) => setAbierto(visibles[indiceAbierto + paso].id)}
        />
      )}
    </div>
  );
}
