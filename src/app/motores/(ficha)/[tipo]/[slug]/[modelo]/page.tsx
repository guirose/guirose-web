import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  buscarModelo,
  esTipoMotor,
  motores,
  ofrecidas,
  slugDe,
  slugModelo,
  tieneDosMandos,
} from "@/contenido/motores";
import HojaModelo from "../../../_ficha/HojaModelo";

type Props = {
  params: Promise<{ tipo: string; slug: string; modelo: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return motores.filter(tieneDosMandos).flatMap((m) =>
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

export default async function PaginaModelo({ params }: Props) {
  const { tipo, slug, modelo } = await params;
  if (!esTipoMotor(tipo)) notFound();
  const encontrado = buscarModelo(tipo, slug, modelo);
  if (!encontrado) notFound();

  return <HojaModelo motor={encontrado.motor} variante={encontrado.variante} />;
}
