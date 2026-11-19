import { Fragment } from "react";
import { ruta } from "@/ruta";
import type { DocumentoLegal as Documento } from "@/contenido/legal";

function Texto({ texto }: { texto: string }) {
  const trozos = texto.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {trozos.map((trozo, i) => {
        const negrita = trozo.match(/^\*\*([^*]+)\*\*$/);
        if (negrita) {
          return (
            <strong key={i} className="font-semibold text-guirose-marino">
              {negrita[1]}
            </strong>
          );
        }
        const enlace = trozo.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (enlace) {
          return (
            <a
              key={i}
              href={ruta(enlace[2])}
              className="text-guirose-accion underline decoration-1 underline-offset-[3px] hover:text-guirose-marino"
            >
              {enlace[1]}
            </a>
          );
        }
        return <Fragment key={i}>{trozo}</Fragment>
      })}
    </>
  );
}

export default function DocumentoLegal({ doc }: { doc: Documento }) {
  return (
    <div className="mx-auto max-w-[1306px] px-6 pb-20 pt-8 lg:px-[67px]">
      {/* Fecha y version */}
      <p className="flex flex-wrap justify-center gap-2 text-sm font-medium text-guirose-texto">
        <span className="rounded-full bg-guirose-espuma px-3.5 py-1.5">
          Vigente desde el {doc.vigente}
        </span>
        <span className="rounded-full bg-guirose-espuma px-3.5 py-1.5">
          Versión {doc.version}
          {doc.preliminar && " (preliminar)"}
        </span>
      </p>

      <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-[280px_minmax(0,720px)] lg:gap-14">
        <article className="lg:col-start-2">
          <p className="text-lg leading-relaxed text-guirose-marino">
            <Texto texto={doc.intro} />
          </p>
        </article>
      </div>
    </div>
  );
}