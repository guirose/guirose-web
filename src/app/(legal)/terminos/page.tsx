import type { Metadata } from "next";
import { TERMINOS } from "@/contenido/legal";
import DocumentoLegal from "@/ui/DocumentoLegal";
import CabeceraLegal from "../_legal/CabeceraLegal";

export const metadata: Metadata = {
  title: "Términos y condiciones | GUIROSE",
  description: TERMINOS.bajada,
};

export default function PaginaTerminos() {
  return (
    <>
      <CabeceraLegal doc={TERMINOS} />
      <DocumentoLegal doc={TERMINOS} />
    </>
  );
}