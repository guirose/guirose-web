import type { Metadata } from "next";
import Gracias from "../_cotizacion/Gracias";

export const metadata: Metadata = {
  title: "Gracias por tu cotizacion | GUIROSE",
  robots: { index: false },
};

export default function PaginaGracias() {
  return <Gracias />
}