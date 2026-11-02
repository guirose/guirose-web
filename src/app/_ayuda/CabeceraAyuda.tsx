import Image from "next/image";
import HeroInterno from "@/ui/HeroInterno";
import PestanasAyuda from "@/app/_ayuda/PestanasAyuda";

export default function CabeceraAyuda() {
  return (
    <>
      <HeroInterno
        titulo="Centro de ayuda GUIROSE"
        descripcion="Consulta las garantías de motores fuera de borda Mercury y las preguntas frecuentes."
        imagen={
          <Image
            src="/imagenes/banner-garantia.webp"
            alt=""
            fill
            preload
            sizes="(min-width; 640px) 62vw, 100vw"
            className="object-cover object-[center_62%]"
          />
        }
      />
      <div className="px-6 pt-6 lg:px-[67px]">
        <PestanasAyuda />
      </div>
    </>
  )
}