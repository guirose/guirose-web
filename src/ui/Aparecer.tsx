"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type PropsAparecer = {
  children: ReactNode;
  retraso?: number;
  className?: string;
};

export default function Aparecer({
  children,
  retraso = 0,
  className = "",
}: PropsAparecer) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`aparecer ${visible ? "visible" : ""} ${className}`}
      style={{ "--retraso": `${retraso}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}