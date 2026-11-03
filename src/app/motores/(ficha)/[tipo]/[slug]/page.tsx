import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import BandaFicha from "@/ui/BandaFicha";
import BarraFicha from "@/ui/BarraFicha";
import Boton from "@/ui/Boton";
import FichaTecnica from "@/ui/FichaTecnica";
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
} from "@/contenido/motores";
import { ruta } from "@/ruta";

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

  const claves = [
    { valor: motor.datos.cilindrada, etiqueta: "Cilindrada" },
    { valor: rangoPeso(motor), etiqueta: "Peso" },
    { valor: rangoAltura(motor), etiqueta: "Altura" },
  ];

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

        <section
          aria-label={`Mercury ${motor.linea} ${motor.hp} HP`}
          className="grid items-center gap-8 pb-4 lg:grid-cols-2 lg:gap-14"
        >
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

          <div>
            <div className="flex gap-2">
              <span className="rounded-full bg-guirose-accion px-3 py-1 text-sm font-semibold text-white">
                {info.nombre}
              </span>
              <span className="rounded-full border border-guirose-accion px-3 py-1 text-sm font-semibold text-guirose-accion">
                {motor.linea}
              </span>
            </div>

            <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[44px]">
              Mercury {motor.linea} {motor.hp} HP
            </h1>
            <p className="mt-3 max-w-[560px] text-base text-guirose-texto lg:text-lg">
              {DESCRIPCION}
            </p>

            <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-guirose-espuma-fuerte py-4">
              {claves.map((c) => (
                <div key={c.etiqueta}>
                  <dd className="text-lg font-bold text-guirose-marino lg:text-xl">
                    {c.valor}
                  </dd>
                  <dt className="text-sm text-guirose-texto">{c.etiqueta}</dt>
                </div>
              ))}
            </dl>

            <Boton
              href="#"
              variante="relleno"
              className="mt-6 h-14 justify-center gap-3 px-6 text-lg font-semibold lg:w-fit"
            >
              Cotizar este motor
            </Boton>
            <p className="mt-3 text-sm text-guirose-texto">
              Puedes elegir el control y la altura al cotizar. *Imagen
              referencial.
            </p>
          </div>
        </section>

        <FichaTecnica hp={motor.hp} base={fichaDe(motor)} />
      </div>

      <BandaFicha beneficios={BENEFICIOS} idealPara={IDEAL_PARA} />
    </>
  );
}
