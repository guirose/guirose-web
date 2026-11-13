import Image from "next/image";
import HeroInterno from "@/ui/HeroInterno";

export default function BannerFicha() {
  return (
    <HeroInterno
      tono="claro"
      esTituloPrincipal={false}
      titulo="Tu motor ideal, listo para cotizar"
      descripcion="Revisa tu selección y recibe una propuesta asesorada por GUIROSE"
      imagen={
        <Image
          src="/imagenes/banner-ficha.jpg"
          alt=""
          fill
          sizes="(min-width: 640px) 62vw, 100vw"
          className="object-cover obect-right"
        />
      }
    />
  );
}