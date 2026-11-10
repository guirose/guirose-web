import type { Metadata } from "next";
import Image from "next/image";
import HeroInterno from "@/ui/HeroInterno";
import ResumenCotizacion from "./_cotizacion/ResumenCotizacion";

export const metadata: Metadata = { title: "Revisa tu cotización | GUIROSE" };

export default function PaginaCotizacion() {
  return (
    <>
      <HeroInterno
        tono="claro"
        esTituloPrincipal={false}
        titulo="Tu cotización, casi lista"
        descripcion="Revisa tu equipo y deja tus datos para recibir la propuesta de un asesor."
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
      <ResumenCotizacion />
    </>
  );
}