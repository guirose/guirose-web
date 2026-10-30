import type { Metadata } from "next";
import Image from "next/image";
import CabeceraAyuda from "@/app/_ayuda/CabeceraAyuda";
import SelectorGarantia from "@/ui/SelectorGarantia";
import type { PanelGarantia } from "@/ui/SelectorGarantia";
import { describirHoras, garantias } from "@/contenido/garantia";
import type { TipoMotor } from "@/contenido/garantia";

export const metadata: Metadata = {
  title: "Garantía | GUIROSE",
};

// Cómo se ve cada tipo de motor.
const aspecto: Record<
  TipoMotor,
  { etiqueta: string; color: PanelGarantia["color"]; foto: string; alt: string }
> = {
  "2 tiempos": {
    etiqueta: "2 TIEMPOS",
    color: "rojo",
    foto: "/imagenes/motor-2-tiempos.png",
    alt: "Motor fuera de borda Mercury de 2 tiempos",
  },
  "4 tiempos": {
    etiqueta: "4 TIEMPOS",
    color: "marino",
    foto: "/imagenes/motor-4-tiempos.png",
    alt: "Motor fuera de borda Mercury de 4 tiempos",
  },
};

export default function PaginaGarantia() {
  const paneles: PanelGarantia[] = garantias.map((garantia) => {
    const { etiqueta, color, foto, alt } = aspecto[garantia.tipo];

    return {
      titulo: garantia.tipo,
      etiqueta,
      color,
      imagen: (
        <Image
          src={foto}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 420px, 80vw"
          className="object-contain"
        />
      ),
      usos: garantia.periodos.map((periodo) => ({
        uso: periodo.uso,
        anios: periodo.anios,
        leyenda: describirHoras(periodo),
      })),
    };
  });

  return (
    <>
      <CabeceraAyuda activa="garantia" />
      <section className="mx-auto max-w-[1440px] px-6 py-12 lg:px-[67px] lg:py-16">
        <SelectorGarantia paneles={paneles} />
      </section>
    </>
  );
}
