import type { Metadata } from "next";
import { PRIVACIDAD } from "@/contenido/legal";
import DocumentoLegal from "@/ui/DocumentoLegal";
import CabeceraLegal from "../_legal/CabeceraLegal";

export const metadata: Metadata = {
  title: "Política de privacidad | GUIROSE",
  description: PRIVACIDAD.bajada,
};

export default function PaginaPrivacidad() {
  return (
    <>
      <CabeceraLegal doc={PRIVACIDAD} />
      <DocumentoLegal doc={PRIVACIDAD} />
    </>
  );
}