import type { Metadata } from "next";
import Image from "next/image";
import CabeceraAyuda from "@/app/_ayuda/CabeceraAyuda";
import SelectorGarantia from "@/ui/SelectorGarantia";
import Desplegable from "@/ui/Desplegable";
import type { PanelGarantia } from "@/ui/SelectorGarantia";
import { CORREO_SOPORTE, NOMBRE_TIENDA, describirHoras, garantias } from "@/contenido/garantia";
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
      <section className="mx-auto flex max-w-[1000px] flex-col gap-4 px-6 pb-12 lg:pb-16">
        <Desplegable titulo="Cambios no atribuibles a garantía">
          <p>
            La empresa se reserva el derecho de aceptar el cambio de un producto que no sea atribuible a mal funcionamiento por defectos de fábrica.
            De ser este el caso, el cliente tiene hasta siete (7) días calendario contados desde la fecha en que recibió el producto para solicitar el cambio.
            Para ello debe cominicarse al correo{" "}
            <a
              href={`mailto:${CORREO_SOPORTE}`}
              className="text-guirose-accion underline underline-offset-4"
            >
              {CORREO_SOPORTE}
            </a>
            .
          </p>
        </Desplegable>

        <Desplegable titulo="Devolusiones">
          <p>
            Solo se acepta la devolución de productos que cumplan las siguientes condiciones:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Hayan sido adquiridos en la tienda {NOMBRE_TIENDA}</li>
            <li>
                Hayan presentado problemas de funcionamiento atribuibles a 
            </li>
          </ul>
        </Desplegable>
      </section>
    </>
  );
}
