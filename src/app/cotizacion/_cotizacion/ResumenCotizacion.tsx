"use client";

import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretDownIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react/ssr";
import { fotoDe, rutaDe } from "@/contenido/motores";
import { resolverCotizacion, type LineaResumen } from "@/cotizacion/resolver";
import { useCotizacion } from "@/cotizacion/useCotizacion";
import { ruta } from "@/ruta";
import Aparecer from "@/ui/Aparecer";
import FotoAccesorio from "@/app/equipamiento/_equipamiento/FotoAccesorio";
import IndicadorPasos from "./IndicadorPasos";
import TarjetasIncluidos from "./TarjetasIncluidos";
import PanelCotizacion, { textoCorto } from "./PanelCotizacion";
import Vacio from "./Vacio";
import { botonPrincipal, enlace } from "./estilos";

function TituloSeccion({
  children,
  accion,
}: {
  children: ReactNode;
  accion?: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-[26px] leading-tight font-bold tracking-[-0.02em] text-guirose-marino lg:text-[28px]">
          {children}
        </h2>
        {accion}
      </div>
      <div className="relative mt-3 h-px bg-guirose-espuma-fuerte">
        <span className="absolute top-0 left-0 h-0.5 w-24 -translate-y-px bg-guirose-azul" />
      </div>
    </div>
  );
}

function Cambiar({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={enlace}>
      <PencilSimpleIcon aria-hidden="true" className="h-[18px] w-[18px]" />
      {children}
    </a>
  );
}

function Tarjeta({ linea }: { linea: LineaResumen }) {
  return (
    <li className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
        <div className="absolute inset-0">
          <FotoAccesorio
            foto={linea.foto}
            className="h-full w-full rounded-xl bg-guirose-espuma"
          />
        </div>
        {linea.cantidad !== undefined && (
          <span className="absolute top-1.5 right-1.5 flex h-[30px] min-w-[30px] items-center justify-center rounded-full bg-guirose-accion px-2 text-[15px] font-bold text-white">
            ×{linea.cantidad}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-guirose-accion">
        {linea.etiqueta}
      </p>
      <p className="-mt-1.5 text-[15px] leading-snug font-semibold text-guirose-marino">
        {linea.nombre}
      </p>
      {linea.detalle && (
        <p className="-mt-1.5 text-sm leading-snug text-guirose-texto">
          {linea.detalle}
        </p>
      )}
    </li>
  );
}

export default function ResumenCotizacion() {
  const { seleccion, listo } = useCotizacion();
  const resumen = useMemo(
    () => (seleccion ? resolverCotizacion(seleccion) : null),
    [seleccion],
  );

  // antes de leer lo guardado se reserva el espacio para que la página no salte
  if (!listo) return <div aria-hidden="true" className="min-h-[70vh]" />;
  if (!seleccion || !resumen) return <Vacio />;

  const {
    motor,
    variante,
    nombreMotor,
    caracteristicas,
    medidas,
    extensiones,
    opcionales,
    tarjetasIncluidos,
    listaIncluidos,
    totalIncluidos,
    sinEquipamiento,
  } = resumen;

  const hrefEquipamiento = ruta(
    `/equipamiento/${seleccion.tipo}/${seleccion.modelo}`,
  );
  const hrefMotor = ruta(rutaDe(motor));
  const elegidas = [...medidas, ...extensiones, ...opcionales];
  const hrefDatos = ruta("/cotizacion/datos");
  const resumenCorto = textoCorto(resumen);

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-12 lg:px-[67px] lg:pb-16">
        {/* título y pasos */}
        <div className="flex flex-col-reverse gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div>
            <h1 className="text-[32px] leading-tight font-bold tracking-[-0.02em] text-guirose-marino lg:text-[40px]">
              Revisa tu cotización
            </h1>
            <p className="mt-2 text-lg text-guirose-texto">
              Confirma lo que elegiste. Si algo no está bien, toca «Cambiar».
            </p>
          </div>
          <div className="lg:mt-1.5">
            <IndicadorPasos actual={1} />
          </div>
        </div>
        <div className="relative mt-4 h-px bg-guirose-espuma-fuerte">
          <span className="absolute top-0 left-0 h-0.5 w-24 -translate-y-px bg-guirose-azul" />
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div className="flex min-w-0 flex-col gap-10">
            {/* tu motor */}
            <Aparecer>
              <section aria-labelledby="titulo-motor">
                <TituloSeccion>
                  <span id="titulo-motor">Tu motor</span>
                </TituloSeccion>
                <div className="mt-5 flex items-start gap-4 sm:gap-5">
                  <div className="relative h-24 w-24 sm:h-[132px] sm:w-[132px] shrink-0 rounded-xl bg-guirose-espuma">
                    <Image
                      src={fotoDe(motor)}
                      alt={`Motor ${nombreMotor}`}
                      fill
                      sizes="132px"
                      className="object-contain p-2 mix-blend-multiply"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col items-start gap-1 sm:flex-row sm:justify-between sm:gap-3">
                      <h3 className="text-xl sm:text-2xl leading-tight font-bold text-guirose-marino">
                        {nombreMotor}
                      </h3>
                      <Cambiar href={hrefMotor}>Cambiar motor</Cambiar>
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      <li className="rounded-full bg-guirose-accion px-3 py-1 text-sm font-bold text-white">
                        {variante.codigo}
                      </li>
                      {caracteristicas.map((c) => (
                        <li
                          key={c}
                          className="rounded-full border-[1.5px] border-guirose-accion px-3 py-[3px] text-sm font-semibold text-guirose-accion"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </Aparecer>
            {sinEquipamiento ? (
              // modelo sin lista de accesorios que el asesor los confirma
              <Aparecer retraso={80}>
                <section aria-labelledby="titulo-accesorios">
                  <TituloSeccion>
                    <span id="titulo-accesorios">Accesorios</span>
                  </TituloSeccion>
                  <div className="mt-5 rounded-2xl bg-guirose-espuma p-5 lg:p-6">
                    <p className="text-lg font-semibold text-guirose-marino">
                      Tu asesor los confirma por WhatsApp
                    </p>
                    <p className="mt-1.5 max-w-[560px] text-base text-guirose-texto">
                      Para este modelo todavía no tenemos la lista de accesorios
                      en la web. Al recibir tu cotización, un asesor te enviará
                      lo que incluye y lo que necesita tu motor.
                    </p>
                  </div>
                </section>
              </Aparecer>
            ) : (
              <>
                {/* lo que elegiste */}
                <Aparecer retraso={80}>
                  <section aria-labelledby="titulo-elegiste">
                    <TituloSeccion
                      accion={
                        <Cambiar href={hrefEquipamiento}>Cambiar</Cambiar>
                      }
                    >
                      <span id="titulo-elegiste">Lo que elegiste</span>
                    </TituloSeccion>
                    <ul className="mt-5 grid grid-cols-2 gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
                      {elegidas.map((linea) => (
                        <Tarjeta key={linea.clave} linea={linea} />
                      ))}
                    </ul>
                  </section>
                </Aparecer>
                {/* lo que ofrece GUIROSE */}
                <Aparecer retraso={160}>
                  <section aria-labelledby="titulo-ofrece-resumen">
                    <TituloSeccion>
                      <span id="titulo-ofrece-resumen">
                        Lo que ofrece GUIROSE
                      </span>
                    </TituloSeccion>
                    <TarjetasIncluidos items={tarjetasIncluidos} />
                    <details className="group mt-5">
                      <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-base font-semibold text-guirose-accion [&::-webkit-details-marker]:hidden">
                        Ver los {totalIncluidos} ítems incluidos
                        <CaretDownIcon
                          aria-hidden="true"
                          className="h-5 w-5 transition duration-150 ease-out group-open:rotate-180"
                        />
                      </summary>
                      <ul className="mt-2 list-disc pl-5 text-[15px] leading-snug text-guirose-texto lg:columns-2 lg:gap-x-10 [&>li]:mb-2 [&>li]:break-inside-avoid">
                        {listaIncluidos.map((texto, i) => (
                          <li key={`${i}-${texto}`}>{texto}</li>
                        ))}
                      </ul>
                    </details>
                  </section>
                </Aparecer>
              </>
            )}
          </div>
          {/* resumen fijo para vista en escritorio */}
          <PanelCotizacion
            resumen={resumen}
            className="hidden lg:sticky lg:top-[140px] lg:block"
          >
            <p className="mt-2 text-[15px] leading-snug text-guirose-texto">
              Todavía no se envía nada. El siguiente paso es dejar tus datos
              para recibir la propuesta.
            </p>
            <a href={hrefDatos} className={`${botonPrincipal} mt-5`}>
              Continuar con mis datos
              <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
            </a>
            <a
              href={hrefEquipamiento}
              className={`${enlace} mt-2 w-full justify-center`}
            >
              <ArrowLeftIcon aria-hidden="true" className="h-[18px] w-[18px]" />
              Volver al equipamiento
            </a>
          </PanelCotizacion>
        </div>
      </div>

      {/* barra fija de abajo para vista en celular */}
      <div className="sticky bottom-0 z-20 border-t border-guirose-espuma-fuerte bg-white px-6 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <p className="mb-2 text-center text-sm text-guirose-texto">
          {resumenCorto}
        </p>
        <a href={hrefDatos} className={botonPrincipal}>
          Continuar con mis datos
          <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
        </a>
      </div>
    </>
  );
}
