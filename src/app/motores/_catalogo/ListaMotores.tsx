import Image from "next/image";
import TarjetaCatalogo from "@/ui/TarjetaCatalogo";
import {
  idDe,
  infoTipo,
  motoresDe,
  rutaDe,
  type TipoMotor,
} from "@/contenido/motores";
import { ruta } from "@/ruta";

// fotos de motores provisionales de cada uno
const fotos: Record<TipoMotor, string> = {
  "2-tiempos": "/imagenes/motor-2-tiempos.png",
  "4-tiempos": "/imagenes/motor-4-tiempos.png",
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
          className="absolute -bottom-0.5 left-0 h-0.5 w-[72px] bg-guirose-azul lg:w-24"
        />
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {motoresDe(tipo).map((m) => (
          <TarjetaCatalogo
            key={idDe(m)}
            id={idDe(m)}
            hp={m.hp}
            linea={m.linea}
            hrefFicha={ruta(rutaDe(m))}
            imagen={
              <Image
                src={fotos[tipo]}
                alt={`Motor Mercury ${m.linea} de ${m.hp}`}
                fill
                sizes="(min-width: 1280px) 220px, 45vw"
                className="object-contain"
              />
            }
          />
        ))}
      </div>

      <p className="mt-6 text-sm text-guirose-texto">*Imágenes referenciales.</p>
    </section>
  );
}