import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buscarMotor,
  esTipoMotor,
  motores,
  ofrecidas,
  slugDe,
  tieneDosMandos,
} from "@/contenido/motores";
import HojaMando from "../../_ficha/HojaMando";
import HojaModelo from "../../_ficha/HojaModelo";

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

  // dos mandos: hoja 1 para elegir; uno solo: directo a "Tu modelo"
  return tieneDosMandos(motor) ? (
    <HojaMando motor={motor} />
  ) : (
    <HojaModelo motor={motor} variante={ofrecidas(motor)[0]} />
  );
}
