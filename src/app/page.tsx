import Image from "next/image";
import Hero from "@/ui/Hero";

export default function Home() {
  return (
    <main>
      <Hero
        etiqueta="Prepárate para la temporada"
        titulo="Tu próximo motor empieza aquí."
        descripcion="Elige sus características y completa tu equipo con asesoría GUIROSE."
        textoBoton="Encontrar mi motor"
        hrefBoton="#"
        fondo={
          <Image
            src="/imagenes/hero.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-right"
          /> 
        }
      />
    </main>
  );
}