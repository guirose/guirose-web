import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BandaFicha from "@/ui/BandaFicha";
import BarraFicha from "@/ui/BarraFicha";
import { BENEFICIOS, IDEAL_PARA } from "@/contenido/ficha";
import {
  buscarMotor,
  esTipoMotor,
  fichaDe,
  fotoDe,
  idDe,
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
import HeroInterno from "@/ui/HeroInterno";

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
      <HeroInterno
        tono="claro"
        esTituloPrincipal={false}
        titulo="Tu motor ideal, listo para cotizar"
        descripcion="Revisa tu selección y recibe una propuesta asesorada por GUIROSE"
        imagen={
          <Image
            src="/imagenes/banner-ficha.jpg"
            alt=""
            fill
            sizes="(min-width: 640px) 62vw, 100vw"
            className="object-cover object-right"
          />
        }
      />
      <FichaInteractiva
        key={idDe(motor)}
        barra={
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
        }
        imagen={
          <div className="ficha-foto relative mx-auto aspect-square w-full max-w-[560px] lg:max-w-[640px]">
            <Image
              src={fotoDe(motor)}
              alt={`Motor Mercury ${motor.linea} de ${motor.hp} HP`}
              fill
              preload
              sizes="(min-width: 1024px) 640px, 90vw"
              className="object-contain mix-blend-multiply"
            />
          </div>
        }
        tipoNombre={info.nombre}
        linea={motor.linea}
        hp={motor.hp}
        descripcion={motor.descripcion}
        cilindrada={motor.datos.cilindrada}
        rangoPeso={rangoPeso(motor)}
        rangoAltura={rangoAltura(motor)}
        modelos={motor.variantes.map(vistaDe)}
        base={fichaDe(motor)}
      >
        <BandaFicha beneficios={BENEFICIOS} idealPara={IDEAL_PARA} />
      </FichaInteractiva>
    </>
  );
}
