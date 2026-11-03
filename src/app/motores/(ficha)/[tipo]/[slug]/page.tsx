import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BandaFicha from "@/ui/BandaFicha";
import BarraFicha from "@/ui/BarraFicha";
import { BENEFICIOS, DESCRIPCION, IDEAL_PARA } from "@/contenido/ficha";
import {
  buscarMotor,
  esTipoMotor,
  fichaDe,
  fotoDe,
  infoTipo,
  motores,
  rangoAltura,
  rangoPeso,
  rutaDe,
  slugDe,
  vecinosDe,
  vistaDe,
} from "@/contenido/motores";
import { ruta } from "@/ruta";
import FichaInteractiva from "../../_ficha/FichaInteractiva";

type Props = { params: Promise<{ tipo: string; slug: string }> };

export const dynamicParams = false;

// Una página por cada motor de la lista
export function generateStaticParams() {
  return motores.map((m) => ({ tipo: m.tipo, slug: slugDe(m) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo, slug } = await params;
  if (!esTipoMotor(tipo)) return {};
  const motor = buscarMotor(tipo, slug);
  if (!motor) return {};
  return { title: `Mercury ${motor.linea} ${motor.hp} HP | GUIROSE` };
}

export default async function PaginaFicha({ params }: Props) {
  const { tipo, slug } = await params;
  if (!esTipoMotor(tipo)) notFound();
  const motor = buscarMotor(tipo, slug);
  if (!motor) notFound();

  const info = infoTipo[tipo];
  const { anterior, siguiente } = vecinosDe(motor);

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[67px]">
        <BarraFicha
          migas={[
            { texto: "Motores", href: ruta("/motores") },
            { texto: info.nombre, href: ruta(`/motores/${tipo}`) },
            { texto: `${motor.hp} HP` },
          ]}
          anterior={
            anterior && {
              texto: `${anterior.hp} HP`,
              href: ruta(rutaDe(anterior)),
            }
          }
          siguiente={
            siguiente && {
              texto: `${siguiente.hp} HP`,
              href: ruta(rutaDe(siguiente)),
            }
          }
        />

        <FichaInteractiva
          imagen={
            <div className="relative mx-auto aspect-square w-full max-w-[460px] rounded-lg bg-guirose-espuma">
              <span
                aria-hidden="true"
                className="absolute inset-0 flex select-none items-center justify-center text-[120px] font-extrabold leading-none text-white/70 lg:text-[200px]"
              >
                {motor.hp}
              </span>
              <Image
                src={fotoDe(motor)}
                alt={`Motor Mercury ${motor.linea} de ${motor.hp} HP`}
                fill
                preload
                sizes="(min-width: 1024px) 460px, 90vw"
                className="object-contain mix-blend-multiply"
              />
            </div>
          }
          tipoNombre={info.nombre}
          linea={motor.linea}
          hp={motor.hp}
          descripcion={DESCRIPCION}
          cilindrada={motor.datos.cilindrada}
          rangoPeso={rangoPeso(motor)}
          rangoAltura={rangoAltura(motor)}
          modelos={motor.variantes.map(vistaDe)}
          base={fichaDe(motor)}
        />
      </div>

      <BandaFicha beneficios={BENEFICIOS} idealPara={IDEAL_PARA} />
    </>
  )
}
