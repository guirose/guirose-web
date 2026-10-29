import Image from "next/image";
import HeroInterno from "@/ui/HeroInterno";
import Pestanas from "@/ui/Pestanas";
import { ruta } from "@/ruta";

type Props = {
  activa: "garantia" | "preguntas";
};

export default function CabeceraAyuda({ activa }: Props) {
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
            sizes="(min-width: 640px) 62vw, 100vw"
            className="object-cover object-[center_62%]"
          />
        }
      />
      <div className="px-6 pt-10 lg:px-[67px]">
        <Pestanas
          pestanas={[
            {
              texto: "Garantía",
              href: ruta("/garantia"),
              icono: "garantia",
              activa: activa === "garantia",
            },
            {
              texto: "Preguntas frecuentes",
              href: ruta("/preguntas-frecuentes"),
              icono: "preguntas",
              activa: activa === "preguntas",
            },
          ]}
        />
      </div>
    </>
  );
}
