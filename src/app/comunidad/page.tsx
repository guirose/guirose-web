import type { Metadata } from "next";
import Seccion from "@/ui/Seccion";
import GaleriaVideos from "./_comunidad/GaleriaVideos";

export const metadata: Metadata = {
  title: "Comunidad GUIROSE | Motores fuera de borda Mercury",
  description: "Mira las entregas de motores Mercury a nuestros clientes y los consejos de GUIROSE para cuidar tu embarcación.",
};

export default function PaginaComunidad() {
  return (
    <main>
      <Seccion
        titulo="Comunidad GUIROSE"
        subtitulo="Entregas de motores Mercury a nuestros clientes y consejos para tu embarcación."
      >
        <GaleriaVideos />
      </Seccion>
    </main>
  );
}