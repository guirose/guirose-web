import Image from "next/image";
import HeroInterno from "../../ui/HeroInterno";

export default function PaginaGarantia() {
  return (
    <HeroInterno
      titulo="Centro de ayuda GUIROSE"
      descripcion="Consulta las garantías de motores fuera de borda Mercury y las preguntas frecuentes."
      imagen={
        <Image
          src="/imagenes/banner-garantia.webp"
          alt=""
          fill
          preload
          sizes="(min-width: 640px) 62vw, 100vw"
          className="object-cover object-[center_62%]"
        />
      }
    />
  );
}
