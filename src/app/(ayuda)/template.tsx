"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function PlantillaAyuda({ children }:{ children: ReactNode }) {
  const camino = usePathname();
  const desde = camino.includes("preguntas-frecuentes") ? "derecha" : "izquierda";

  return (
    <div className="ayuda-entra" data-desde={desde}>
      {children}
    </div>
  );
;}