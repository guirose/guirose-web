import { Fragment } from "react";
import {
  ClockIcon,
  CreditCardIcon,
  ListBulletsIcon,
  ProhibitIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/ssr";
import { ruta } from "@/ruta";
import type { DocumentoLegal as Documento, IconoEsencial } from "@/contenido/legal";

const iconos: Record<IconoEsencial, typeof ReceiptIcon> = {
  cotiza: ReceiptIcon,
  pago: CreditCardIcon,
  escudo: ShieldCheckIcon,
  lista: ListBulletsIcon,
  mano: ProhibitIcon,
  reloj: ClockIcon,
  persona: UserCircleIcon,
};

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

      {/* Lo esencial */}
      <section
        aria-labelledby="lo-esencial"
        className="mt-8 rounded-3xl bg-guirose-espuma px-5 py-6 sm:px-9 sm:py-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="lo-esencial" className="text-[22px] font-bold text-guirose-marino sm:text-2xl">
            Lo esencial
          </h2>
          <p className="text-sm text-guirose-texto">
            Un resumen en palabras simples. El texto completo está debajo.
          </p>
        </div>
        <ul
          className={`mt-5 grid gap-5 sm:grid-cols-2 lg:gap-7 ${
            doc.esencial.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          }`}
        >
          {doc.esencial.map((item) => {
            const Icono = iconos[item.icono];
            return (
              <li key={item.titulo} className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-guirose-accion">
                  <Icono aria-hidden="true" className="h-[22px] w-[22px]" />
                </span>
                <div>
                  <p className="font-semibold leading-snug text-guirose-marino">{item.titulo}</p>
                  <p className="mt-1 text-[15px] leading-normal text-guirose-texto">{item.texto}</p>                </div>
              </li>
            );
          })}
        </ul>
      </section>

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