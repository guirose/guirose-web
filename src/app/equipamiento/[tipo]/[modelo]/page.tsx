import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BarraFicha from "@/ui/BarraFicha";
import { equipamientoDe } from "@/contenido/equipamiento";
import {
  buscarVariante,
  esTipoMotor,
  infoTipo,
  rutaDe,
  todasLasVariantes,
} from "@/contenido/motores";
import { ruta } from "@/ruta";
import SeccionMedidas from "../../_equipamiento/SeccionMedidas";
import SeccionOfrece from "../../_equipamiento/SeccionOfrece";
import PasosCotizacion from "@/ui/PasosCotizacion";
import FranjaCotizar from "../../_equipamiento/FranjaCotizar";
import BarraCotizar from "../../_equipamiento/BarraCotizar";
import Image from "next/image";
import HeroInterno from "@/ui/HeroInterno";

type Props = { params: Promise<{ tipo: string; modelo: string }> };

export const dynamicParams = false;

// una pagina por cada variante de cada motor
export function generateStaticParams() {
  return todasLasVariantes().map(({ tipo, codigo }) => ({
    tipo,
    modelo: codigo,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { modelo } = await params;
  return { title: `Equipamiento ${modelo} | GUIROSE` };
}

const COLA: Record<number, string> = {
  15: "Cola corta",
  20: "Cola larga",
  25: "Cola extra larga",
};

export default async function PaginaEquipamiento({ params }: Props) {
  const { tipo, modelo } = await params;
  if (!esTipoMotor(tipo)) notFound();
  const encontrado = buscarVariante(tipo, modelo);
  if (!encontrado) notFound();

  const { motor, variante } = encontrado;
  const equipo = equipamientoDe(tipo, modelo);

  return (
    <>
      <HeroInterno
        tono="claro"
        esTituloPrincipal={false}
        titulo="Arma tu equipamiento"
        descripcion="Revisa lo que GUIROSE incluye con tu motor y suma los accesorios que necesites"
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
      <div className="mx-auto max-w-[1440px] px-6 pb-0 lg:px-[67px]">
        <BarraFicha
          migas={[
            { texto: "Motores", href: ruta("/motores") },
            { texto: infoTipo[tipo].nombre, href: ruta(`/motores/${tipo}`) },
            { texto: `${motor.hp} HP`, href: ruta(rutaDe(motor)) },
            { texto: "Equipamiento" },
          ]}
        />

        <header className="pt-2 pb-2 lg:pb-4">
          <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[44px]">
            Equipa tu Mercury {motor.linea} {motor.hp} HP
          </h1>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li className="rounded-full bg-guirose-accion px-3 py-1 text-sm font-semibold text-white">
              {variante.codigo}
            </li>
            {[
              variante.control,
              `${COLA[variante.altura]} ${variante.altura}″`,
              `Elevación ${variante.inclinacion.toLowerCase()}`,
            ].map((texto) => (
              <li
                key={texto}
                className="rounded-full border border-guirose-accion px-3 py-1 text-sm font-semibold text-guirose-accion"
              >
                {texto}
              </li>
            ))}
          </ul>
          <a
            href={ruta(rutaDe(motor))}
            className="mt-4 inline-block text-base font-semibold text-guirose-accion hover:underline"
          >
            Cambiar motor
          </a>
        </header>

        {equipo ? (
          <>
            <SeccionMedidas
              tipo={tipo}
              modelo={modelo}
              grupos={equipo.ofrece.medidas}
              opcionales={equipo.agregar}
            />
            <SeccionOfrece
              items={[...equipo.ofrece.incluido, ...equipo.ofrece.obligatorio]}
            />
          </>
        ) : (
          <section className="mt-6 rounded-2xl bg-guirose-espuma p-6 lg:p-8">
            <h2 className="text-[24px] font-bold text-guirose-marino">
              Tu asesor confirma el equipamiento
            </h2>
            <p className="mt-2 max-w-[560px] text-lg text-guirose-texto">
              Para este modelo el equipo se define contigo. Continúa y tu asesor
              te enviará la lista completa por WhatsApp.
            </p>
          </section>
        )}
      </div>

      {equipo && (
        <>
          <PasosCotizacion />
          <FranjaCotizar href="#" />
          <BarraCotizar href="#" />
        </>
      )}
    </>
  );
}
