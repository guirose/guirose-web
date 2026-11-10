"use client";

import { useSyncExternalStore } from "react";
import { guardarSeleccion, leerSeleccion, suscribir } from "./almacen";

const sinSuscripcion = () => () => {};

export function useCotizacion() {
  const seleccion = useSyncExternalStore(suscribir, leerSeleccion, () => null);
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  return {
    seleccion,
    listo,
    guardar: guardarSeleccion,
    vaciar: () => guardarSeleccion(null),
  };
}