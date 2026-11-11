import type { Metadata } from "next";
import Image from "next/image";
import HeroInterno from "@/ui/HeroInterno";
import FormularioDatos from "../_cotizacion/FormularioDatos";

export const metadata: Metadata = {
  title: "Tus datos | GUIROSE",
  robots: { index: false },
};

export default function PaginaDatos() {
  return (
    <>
      <HeroInterno
        tono="claro"
        esTituloPrincipal={false}
        titulo="Tus datos para tu cotización"
        descripcion="Un asesor de GUIROSE prepara tu propuesta y te escribe por WhatsApp."
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
      <FormularioDatos />
    </>
  )
}