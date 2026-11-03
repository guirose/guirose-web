import type { Metadata } from "next";
import ListaMotores from "./_catalogo/ListaMotores";

export const metadata: Metadata = { title: "Motores Mercury | GUIROSE" };

export default function PaginaMotores() {
  return <ListaMotores tipo="4-tiempos" />;
}