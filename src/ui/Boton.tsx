import type { ReactNode } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";

type PropsBoton = {
  href: string;
  variante: "relleno" | "borde";
  className?: string;
  children: ReactNode;
};

const estilos = {
  relleno: "bg-guirose-azul text-white hover:bg-white hover:text-guirose-azul",
  borde:
    "border border-guirose-marino text-guirose-marino hover:bg-guirose-marino hover:text-white",
};

export default function Boton({
  href,
  variante,
  className = "",
  children,
}: PropsBoton) {
  return (
    <a
      href={href}
      className={`flex items-center rounded-[5px] transition-colors ${estilos[variante]} ${className}`}
    >
      {children}
      <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
    </a>
  );
}
