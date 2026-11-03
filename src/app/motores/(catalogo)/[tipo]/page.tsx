import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListaMotores from "../_catalogo/ListaMotores";
import { TIPOS_MOTOR, esTipoMotor, infoTipo } from "@/contenido/motores";

type Props = { params: Promise<{ tipo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return TIPOS_MOTOR.map((tipo) => ({ tipo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tipo } = await params;
  if (!esTipoMotor(tipo)) return {};
  return { title: `${infoTipo[tipo].titulo} | GUIROSE` };
}

export default async function PaginaTipo({ params }: Props) {
  const { tipo } = await params;
  if (!esTipoMotor(tipo)) notFound();
  return <ListaMotores tipo={tipo} />
}