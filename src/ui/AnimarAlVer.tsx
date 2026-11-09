"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type PropsAnimarAlVer = {
  children: ReactNode;
  className?: string;
};

// Pausa las animaciones hasta que el bloque aparece en la pantalla
export default function AnimarAlVer({
  children,
  className = "",
}: PropsAnimarAlVer) {
  const caja = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const elemento = caja.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting || entrada.boundingClientRect.bottom < 0) {
          setVisto(true);
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={caja}
      data-visto={visto}
      className={`animar-al-ver ${className}`}
    >
      {children}
    </div>
  );
}