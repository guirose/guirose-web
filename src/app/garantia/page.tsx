import type { Metadata } from "next";
import CabeceraAyuda from "@/app/_ayuda/CabeceraAyuda";

export const metadata: Metadata = {
    title: "Garantía | GUIROSE",
};

export default function PaginaGarantia() {
    return <CabeceraAyuda activa="garantia" />
}