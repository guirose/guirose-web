"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Pestanas from "@/ui/Pestanas";

function EnlacePestana(props: ComponentProps<typeof Link>) {
  return <Link {...props} scroll={false} />;
}

export default function PestanasAyuda() {
  const camino = usePathname();
  const enPreguntas = camino.includes("preguntas-frecuentes");

  return (
    <Pestanas
      enlace={EnlacePestana}
      pestanas={[
        { texto: "Garantía", href: "/garantia", icono: "garantia", activa: !enPreguntas },
        { texto: "Preguntas frecuentes", href: "/preguntas-frecuentes", icono: "preguntas", activa: enPreguntas },
      ]}
    />
  )
}