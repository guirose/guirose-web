"use client";

import { ArrowRightIcon } from "@phosphor-icons/react";
import type { TipoMotor } from "@/contenido/motores";
import { seleccionInicial } from "@/cotizacion/seleccion";
import { useCotizacion } from "@/cotizacion/useCotizacion";
import { ruta } from "@/ruta";
import { botonPrincipal } from "@/app/cotizacion/_cotizacion/estilos";

type Props = { tipo: TipoMotor; modelo: string };

// modelo sin lista de equipamiento solo guarda el motor y se pasa al resumen
export default function ContinuarSinEquipo({ tipo, modelo }: Props) {
  const { guardar } = useCotizacion();

  const continuar = () => {
    guardar(seleccionInicial(tipo, modelo, []));
    window.location.assign(ruta("/cotizacion"));
  };

  return (
    <button
      type="button"
      onClick={continuar}
      className={`${botonPrincipal} mt-6 sm:inline-flex sm:w-auto`}
    >
      Continuar sin elegir accesorios
      <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
    </button>
  );
}