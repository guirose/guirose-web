import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnimarAlVer from "@/ui/AnimarAlVer";
import BarraFicha from "@/ui/BarraFicha";
import Boton from "@/ui/Boton";
import HeroInterno from "@/ui/HeroInterno";
import PasosCotizacion from "@/ui/PasosCotizacion";
import {
  buscarModelo,
  esTipoMotor,
  fichaDe,
  fotoDe,
  infoTipo,
  motores,
  ofrecidas,
  pesoDe,
  rutaDe,
  slugDe,
  slugModelo,
  vecinosDe,
  type Altura,
  type TipoMotor,
} from "@/contenido/motores";
import { ruta } from "@/ruta";
import TablaFicha from "../../../_ficha/TablaFicha";
import TarjetaModelo from "../../../_ficha/TarjetaModelo";

type Props = {
  params: Promise<{ tipo: string; slug: string; modelo: string }>;
};

export const dynamicParams = false;

// Una página por cada modelo ofrecido
export function generateStaticParams() {
  return motores.flatMap((m) =>
    ofrecidas(m).map((v) => ({
      tipo: m.tipo,
      slug: slugDe(m),
      modelo: slugModelo(v),
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo, slug, modelo } = await params;
  if (!esTipoMotor(tipo)) return {};
  const encontrado = buscarModelo(tipo, slug, modelo);
  if (!encontrado) return {};
  const { motor, variante } = encontrado;
  return {
    title: `Mercury ${motor.linea} ${motor.hp} HP ${variante.codigo} | GUIROSE`,
  };
}

const COLA: Record<Altura, string> = {
  15: "Cola corta 15″",
  20: "Cola larga 20″",
  25: "Cola extra larga 25″",
};

const COLOR_TIPO: Record<TipoMotor, string> = {
  "2-tiempos": "bg-guirose-rojo",
  "4-tiempos": "bg-guirose-accion",
};

export default async function PaginaModelo({ params }: Props) {
  const { tipo, slug, modelo } = await params;
  if (!esTipoMotor(tipo)) notFound();
  const encontrado = buscarModelo(tipo, slug, modelo);
  if (!encontrado) notFound();

  const { motor, variante } = encontrado;
  const info = infoTipo[tipo];
  const { anterior, siguiente } = vecinosDe(motor);
  const dosMandos = ofrecidas(motor).length > 1;
  const hrefEquipamiento = ruta(`/equipamiento/${tipo}/${variante.codigo}`);

  const claves = [
    { valor: motor.datos.cilindrada, etiqueta: "Cilindrada" },
    { valor: pesoDe(variante), etiqueta: "Peso" },
    { valor: `${variante.altura}″`, etiqueta: "Altura" },
  ];

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

      <div className="mx-auto max-w-[1440px] px-6 lg:px-[67px]">
        <BarraFicha
          migas={[
            { texto: "Motores", href: ruta("/motores") },
            { texto: info.nombre, href: ruta(`/motores/${tipo}`) },
            // con dos mandos, la potencia lleva a la hoja de elegir mando
            dosMandos
              ? { texto: `${motor.hp} HP`, href: ruta(rutaDe(motor)) }
              : { texto: `${motor.hp} HP` },
            ...(dosMandos ? [{ texto: variante.codigo }] : []),
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

        <AnimarAlVer className="mt-4 grid gap-6 pb-10 lg:grid-cols-2 lg:items-start lg:gap-14 lg:pb-12">
          {/* foto fija al bajar */}
          <div className="rounded-[28px] bg-guirose-espuma p-4 sm:p-5 lg:sticky lg:top-40">
            <div className="relative isolate flex items-center justify-center overflow-hidden rounded-2xl bg-white px-4 py-8 lg:h-[min(620px,calc(100vh-13rem))] lg:py-6">
              <span
                aria-hidden="true"
                className="ficha-numero pointer-events-none absolute -bottom-[0.12em] -left-[0.04em] -z-10 select-none text-[190px] font-extrabold leading-none tracking-[-0.04em] text-guirose-accion/10 lg:text-[300px]"
              >
                {motor.hp}
              </span>
              <div className="ficha-foto relative mx-auto aspect-square w-full max-w-[560px] lg:h-full lg:w-auto lg:max-w-full">
                <Image
                  src={fotoDe(motor)}
                  alt={`Motor Mercury ${motor.linea} de ${motor.hp} HP, ${variante.control.toLowerCase()}`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 640px, 90vw"
                  className="object-contain mix-blend-multiply"
                />
              </div>
            </div>
            <p className="mt-3 px-1 text-[13px] text-guirose-texto">
              *Imagen referencial.
            </p>
          </div>

          {/* contenido que se desplaza */}
          <div className="ficha-info min-w-0 lg:pt-2">
            <div className="flex gap-2">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${COLOR_TIPO[tipo]}`}
              >
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
              {motor.descripcion}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
              {claves.map((c) => (
                <div
                  key={c.etiqueta}
                  className="border-l-2 border-guirose-accion pl-4"
                >
                  <dd className="whitespace-nowrap text-lg font-bold text-guirose-marino lg:text-xl">
                    {c.valor}
                  </dd>
                  <dt className="text-sm text-guirose-texto">{c.etiqueta}</dt>
                </div>
              ))}
            </dl>

            <TablaFicha filas={fichaDe(motor)} />

            <TarjetaModelo
              codigo={variante.codigo}
              configuracion={[
                variante.control,
                COLA[variante.altura],
                `Elevación ${variante.inclinacion.toLowerCase()}`,
              ]}
              hrefEquipamiento={hrefEquipamiento}
              hrefCambiar={dosMandos ? ruta(rutaDe(motor)) : undefined}
              mandoUnico={dosMandos ? undefined : variante.control}
            />
          </div>
        </AnimarAlVer>
      </div>

      <PasosCotizacion />

      {/* celular */}
      <div className="sticky bottom-0 z-30 flex items-center gap-3 border-t border-guirose-espuma-fuerte bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <p className="min-w-0 flex-1 text-sm text-guirose-texto">
          Tu modelo
          <span className="block text-lg font-bold text-guirose-marino">
            {variante.codigo}
          </span>
        </p>
        <Boton
          href={hrefEquipamiento}
          variante="relleno"
          className="h-13 shrink-0 justify-center gap-2 px-5 text-base font-semibold"
        >
          Continuar
        </Boton>
      </div>
    </>
  );
}
