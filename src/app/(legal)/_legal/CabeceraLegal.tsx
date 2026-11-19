import HeroInterno from "@/ui/HeroInterno";
import Pestanas from "@/ui/Pestanas";
import { ruta } from "@/ruta";
import type { DocumentoLegal } from "@/contenido/legal";

export default function CabeceraLegal({ doc }: { doc: DocumentoLegal }) {
  return (
    <>
      <HeroInterno titulo={doc.titulo} descripcion={doc.bajada} />
      <div className="px-6 pt-6 lg:px-[67px]">
        <Pestanas
          etiqueta="Información legal"
          pestanas={[
            {
              texto: "Términos",
              href: ruta("/terminos"),
              icono: "terminos",
              activa: doc.ruta === "/terminos",
            },
            {
              texto: "Privacidad",
              href: ruta("/privacidad"),
              icono: "privacidad",
              activa: doc.ruta === "/privacidad",
            },
          ]}
        />
      </div>
    </>
  );
}