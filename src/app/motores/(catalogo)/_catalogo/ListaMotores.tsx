import Image from "next/image";
import TarjetaCatalogo from "@/ui/TarjetaCatalogo";
import {
  fotoDe,
  idDe,
  infoTipo,
  motoresDe,
  rutaDe,
  type TipoMotor,
} from "@/contenido/motores";
import { ruta } from "@/ruta";

const colorPastilla: Record<TipoMotor, string> = {
  "2-tiempos": "bg-guirose-rojo",
  "4-tiempos": "bg-guirose-accion",
};

export default function ListaMotores({ tipo }: { tipo: TipoMotor }) {
  const info = infoTipo[tipo];

  return (
    <section aria-labelledby="titulo-lista">
      <header className="relative mb-7 border-b-2 border-guirose-espuma-fuerte pb-4 lg:mb-8 lg:pb-[18px]">
        <h2
          id="titulo-lista"
          className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[40px]"
        >
          {info.titulo}
        </h2>
        <p className="mt-1.5 text-base text-guirose-texto lg:mt-2 lg:text-lg">
          {info.subtitulo}
        </p>
        <span
          aria-hidden="true"
          className={`mt-3.5 inline-flex h-[30px] items-center rounded-lg px-3.5 text-[13px] font-bold uppercase tracking-[0.02em] text-white lg:mt-4 ${colorPastilla[tipo]}`}
        >
          {info.nombre}
        </span>
      </header>

      <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 xl:grid-cols-4 min-[1400px]:grid-cols-5 min-[1400px]:gap-x-4">
        {motoresDe(tipo).map((m, i) => (
          <TarjetaCatalogo
            key={idDe(m)}
            indice={i}
            id={idDe(m)}
            hp={m.hp}
            linea={m.linea}
            hrefFicha={ruta(rutaDe(m))}
            imagen={
              <Image
                src={fotoDe(m)}
                alt={`Motor Mercury ${m.linea} de ${m.hp}`}
                fill
                sizes="(min-width: 1400px) 190px, (min-width: 1280px) 200px, 45vw"
                className="object-contain"
              />
            }
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-guirose-texto">
        *Imágenes referenciales.
      </p>
    </section>
  );
}