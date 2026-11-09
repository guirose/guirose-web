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
    <div className="mx-auto max-w-[1440px] px-6 pb-16 lg:px-[67px]">
      <BarraFicha
        migas={[
          { texto: "Motores", href: ruta("/motores") },
          { texto: infoTipo[tipo].nombre, href: ruta(`/motores/${tipo}`) },
          { texto: `${motor.hp} HP`, href: ruta(rutaDe(motor)) },
          { texto: "Equipamiento" },
        ]}
      />

      <header className="pt-2 pb-4 lg:pb-8">
        <h1 className="text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[44px]">
          Mercury {motor.linea} {motor.hp} HP - {variante.codigo}
        </h1>
        <p className="mt-3 text-lg text-guirose-texto">
          {variante.control} - {COLA[variante.altura]} {variante.altura}″ -{" "}
          Inclinación {variante.inclinacion.toLowerCase()}
        </p>
        <a
          href={ruta(rutaDe(motor))}
          className="mt-3 inline-block text-base font-semibold text-guirose-accion hover:underline"
        >
          Cambiar motor
        </a>
      </header>

      {equipo ? (
        <>
          <SeccionMedidas
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
          <p className="mt-2 max-w-[560px] text-lg txt-guirose-texto">
            Para este modelo el equipo se define contigo. Continúa y tu asesor te enviará la lista completa por WhatsApp.
          </p>
        </section>
      )}
    </div>
  );
}