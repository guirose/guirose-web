"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  HouseIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import { guardarSeleccion } from "@/cotizacion/almacen";
import { borrarEnvio, interpretarEnvio, leerEnvioTexto } from "@/cotizacion/envio";
import { ruta } from "@/ruta";
import { botonPrincipal, enlace } from "./estilos";

const sinSuscripcion = () => () => {};

const PASOS_SIGUIENTES = [
  "Envías el mensaje que preparamos en Whatsapp.",
  "Un asesor de GUIROSE revisa tu equipo y te responde por el mismo chat.",
  "Recibes tu cotización personalizada y resolvemos tus dudas.",
];

function SinEnvio() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px[67px] lg:py-24">
      <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-guirose-marino lg:text-[36px]">
        No hay una cotización reciente
      </h1>
      <p className="mt-3 max-w-[560px] text-lg text-guirose-texto">
        Vuelve a elegir un equipo.
      </p>
      <a href={ruta("/motores")} className={`${botonPrincipal} mt-8 max-w-[320px]`}>
        Ver motores
        <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
      </a>
    </div>
  );
}

export default function Gracias() {
  const texto = useSyncExternalStore(sinSuscripcion, leerEnvioTexto, () => null);
  const envio = useMemo(() => interpretarEnvio(texto), [texto]);
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false);

  useEffect(() => {
    if (envio) guardarSeleccion(null);
  }, [envio]);

  // al salir de la pantalla se borran los datos personales
  useEffect(() => {
    const alRestaurar = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pagehide", borrarEnvio);
    window.addEventListener("pageshow", alRestaurar);
    return () => {
      window.removeEventListener("pagehide", borrarEnvio);
      window.removeEventListener("pageshow", alRestaurar);
    };
  }, []);

  if(listo && !envio) return <SinEnvio />

  return (
    <div className="mx-auto max-w-[1440px] px-6 pt-10 pb-16 lg:px.[67px] lg:pt-16 lg:pb-20">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <span className="gracias-ok flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#1B7F3B] text-white lg:h-[88px] lg:w-[88px]">
            <CheckIcon
              aria-hidden="true"
              weight="bold"
              className="h-9 w-9 lg:h-11 lg:w-11"
            />
          </span>
          <h1 className="mt-6 text-[34px] leading-[1.08] font-extrabold tracking-[-0.02em] text-guirose-marino lg:text-5xl">
            ¡Gracias! Tu cotización está en camino
          </h1>
          <p className="mt-4 max-w-[600px] text-lg leading-normal text-guirose-texto lg:text-xl">
            {envio?.abierto === false
              ? "Toca el botón para abrir WhatsApp con tu cotización lista."
              : "Abrimos WhatsApp con tu cotización lista. Solo falta que toques Enviar en el chat."}
          </p>

          {envio && (
            <div className="mt-7 rounded-2xl border-[1.5px] border-guirose-espuma-fuerte bg-[#F5FAFF] p-5">
              {envio.abierto && (
                <p className="mb-3.5 text-[17px] leading-snug text-guirose-marino">
                  ¿No se abrió WhatsApp o lo cerraste sin enviar?
                </p>
              )}
              <a
                href={envio.enlace}
                target="_blank"
                rel="noopener"
                className={`${botonPrincipal} sm:w-auto sm:inline-flex`}
              >
                <WhatsappLogoIcon aria-hidden="true" className="h-6 w-6" />
                {envio.abierto ? "Abrir Whatsapp otra vez" : "Abrir Whatsapp"}
              </a>
            </div>
          )}
        </div>

        <section
          aria-labelledby="titulo-sigue"
          className="rounded-[20px] bg-guirose-espuma p-6 lg:p-7"
        >
          <h2
            id="titulo-sigue"
            className="text-2xl font-bold text-guirose-marino"
          >
            ¿Qué sigue ahora?
          </h2>
          <ol className="mt-5 flex flex-col gap-4">
            {PASOS_SIGUIENTES.map((paso, i) => (
              <li
                key={paso}
                className="flex items-start gap-3.5 text-[17px] leading-snug text-guirose-marino"
              >
                <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-guirose-accion font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1">{paso}</span>
              </li>
            ))}
          </ol>
          {envio && (
            <p className="mt-5 flex items-center gap-3 rounded-xl bg-white px-4 py-3.5 text-base font-semibold text-guirose-marino">
              <CheckCircleIcon
                aria-hidden="true"
                weight="fill"
                className="h-6 w-6 shrink-0 text-[#1B7F3B]"
              />
              {envio.motor}
            </p>
          )}
        </section>
      </div>

      <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
        <a
          href={ruta("/")}
          className="inline-flex min-h-[52px] touch-manipulation items-center justify-center gap-2.5 rounded-xl border-2 border-guirose-accion px-6 text-lg font-semibold text-guirose-accion transition duration-150 ease-out hover:bg-guirose-espuma active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul"
        >
          <HouseIcon aria-hidden="true" className="h-5 w-5" />
          Volver al inicio
        </a>
        <a
          href={ruta("/motores")}
          className={`${enlace} justify-center text-lg`}
        >
          Ver otros motores
        </a>
      </div>
    </div>
  );
}