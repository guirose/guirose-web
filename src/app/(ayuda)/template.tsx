"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function PlantillaAyuda({ children }:{ children: ReactNode }) {
  const camino = usePathname();

  return (
    <div key={camino} className="ayuda-entra">
      {children}
    </div>
  );
;}