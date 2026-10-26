"use client";

import { useEffect, useState } from "react";
import Buscador from "./Buscador";
import BotonCotizacion from "./BotonCotizacion";

type PropsEncabezadoFijo = {
  cantidadCotizacion: number;
};

export default function EncabezadoFijo({
  cantidadCotizacion,
}: PropsEncabezadoFijo) {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    function alDesplazar() {
      setMostrar(window.scrollY > 250);
    }
    window.addEventListener("scroll", alDesplazar, { passive: true });
    return () => window.removeEventListener("scroll", alDesplazar);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 hidden border-b border-guirose-borde bg-white shadow-md transition-all duration-200 lg:block ${
        mostrar ? "visible translate-y-0" : "invisible -translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-[1300px] items-center gap-8 px-[70px] py-3">
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight text-guirose-marino transition-opacity hover:opacity-80"
        >
          GUIROSE
        </a>
        <Buscador id="buscador-fijo" className="h-12 max-w-[658px] flex-1" />
        <BotonCotizacion
          cantidad={cantidadCotizacion}
          className="ml-auto h-12"
        />
      </div>
    </div>
  );
}
