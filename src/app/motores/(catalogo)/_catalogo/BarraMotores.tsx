"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import BarraCatalogo from "@/ui/BarraCatalogo";
import {
  TIPOS_MOTOR,
  idDe,
  infoTipo,
  motoresDe,
} from "@/contenido/motores";

function EnlaceBarra(props: ComponentProps<typeof Link>) {
  return <Link scroll={false} {...props} />;
}

export default function BarraMotores() {
  const camino = usePathname();
  // /motores muestra 4 tiempos por defecto
  const tipoActivo = camino.includes("2-tiempos") ? "2-tiempos" : "4-tiempos";

  const tipos = TIPOS_MOTOR.map((tipo) => {
    const lista = motoresDe(tipo);
    return {
      id: tipo,
      titulo: infoTipo[tipo].nombre,
      cantidad: lista.length,
      href: `/motores/${tipo}`,
      activo: tipo === tipoActivo,
      potencias: lista.map((m)  => ({ hp: m.hp, href: `#${idDe(m)}` })),
    };
  });

  return <BarraCatalogo tipos={tipos} enlace={EnlaceBarra} />;
}