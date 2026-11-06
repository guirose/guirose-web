"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import Boton from "@/ui/Boton";
import FichaTecnica from "@/ui/FichaTecnica";
import type { VistaVariante } from "@/contenido/motores";

type Fila = { etiqueta: string; valor: string };

type PropsFichaInteractiva = {
  barra: ReactNode; // migas y flechas, armadas en el servidor
  imagen: ReactNode; // la foto, ya armada en el servidor
  tipoNombre: string; // "4 tiempos"
  linea: string; // "SeaPro"
  hp: number;
  descripcion: string;
  cilindrada: string;
  rangoPeso: string; // "165 – 172 kg"
  rangoAltura: string; // "20–25″"
  modelos: VistaVariante[];
  base: Fila[];
  children: ReactNode; // lo que va debajo (la banda)
};

// la configuracion que elige el cliente
type Campo = "control" | "alturaCorta" | "inclinacion";
const CAMPOS: Campo[] = ["control", "alturaCorta", "inclinacion"];

// lo que el cliente elige
type Eleccion = Partial<Record<Campo, string>>;

const NOMBRE_CORTO: Record<Campo, string> = {
  control: "mando",
  alturaCorta: "cola",
  inclinacion: "elevación",
};

const NOMBRE_COLA: Record<string, string> = {
  "15″": "15″ - cola corta",
  "20″": "20″ - cola larga",
  "25″": "25″ - cola extra larga",
};

const nombreElevacion = (valor: string) =>
  valor === "Eléctrica" ? "Eléctrica (Power Trim)" : valor;

// foto de mandos
const FOTO_MANDO: Record<string, string> = {
  "Mando popero": "/imagenes/mandos/mando-popero.jpg",
  "Control remoto": "/imagenes/mandos/mando-remoto.jpg",
};

const unicos = (lista: VistaVariante[], campo: Campo) => [
  ...new Set(lista.map((m) => m[campo])),
];

const cumple = (m: VistaVariante, eleccion: Eleccion) =>
  CAMPOS.every((c) => eleccion[c] === undefined || m[c] === eleccion[c]);

const juntar = (lista: string[]) =>
  lista.length <= 1 ? (lista[0] ?? "") : `${lista.slice(0, -1).join(", ")} y ${lista[lista.length - 1]}`;

export default function FichaInteractiva({
  barra,
  imagen,
  tipoNombre,
  linea,
  hp,
  descripcion,
  cilindrada,
  rangoPeso,
  rangoAltura,
  modelos,
  base,
  children,
}: PropsFichaInteractiva) {
  const [eleccion, setEleccion] = useState<Eleccion>({});

  const candidatos = modelos.filter((m) => cumple(m, eleccion));

  // configuracion eelgida, si solo hay una se selecciona automaticamente
  const valorDe = (campo: Campo): string | undefined => {
    if (eleccion[campo] !== undefined) return eleccion[campo];
    const posibles = unicos(candidatos, campo);
    return posibles.length === 1 ? posibles[0] : undefined;
  };

  const disponible = (campo: Campo, valor: string) =>
    modelos.some((m) => cumple(m, { ...eleccion, [campo]: valor }));

  const elegir = (campo: Campo, valor: string) =>
    setEleccion((actual) => ({ ...actual, [campo]: valor || undefined }));

  const faltantes = CAMPOS.filter((c) => valorDe(c) === undefined);
  const modelo =
    faltantes.length === 0 ? candidatos.find((m) => CAMPOS.every((c) => m[c] === valorDe(c))) : undefined;

  const claves = [
    { valor: cilindrada, etiqueta: "Cilindrada" },
    { valor: modelo ? modelo.peso : rangoPeso, etiqueta: "Peso" },
    { valor: modelo ? modelo.alturaCorta : rangoAltura, etiqueta: "Altura" },
  ];

  const configuracion = modelo
    ? [
        { etiqueta: "Modelo", valor: modelo.codigo },
        { etiqueta: "Control de aceleración", valor: modelo.control },
        { etiqueta: "Altura de transmisión", valor: modelo.altura },
        { etiqueta: "Inclinación", valor: modelo.inclinacion },
        { etiqueta: "Peso", valor: modelo.peso },
      ]
    : undefined;

  // opciones de cada potencia
  const listas = [
    {
      campo: "alturaCorta" as const,
      titulo: "Longitud de cola",
      nombre: (v: string) => NOMBRE_COLA[v] ?? v,
    },
    {
      campo: "inclinacion" as const,
      titulo: "Tipo de elevación",
      nombre: nombreElevacion,
    },
  ];

  return (
    <div>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[67px]">
        {barra}

        <section
          aria-label={`Mercury ${linea} ${hp} HP`}
          className="mt-4 rounded-[28px] bg-guirose-espuma p-4 sm:p-6"
        >
          <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-9">
            {/* Cuadro blanco con foto del motor */}
            <div className="relative isolate flex items-center justify-center overflow-hidden rounded-2xl bg-white px-4 py-8 lg:min-h-[600px] lg:px-8">
              <span
                aria-hidden="true"
                className="ficha-numero pointer-events-none absolute -bottom-[0.12em] -left-[0.04em] -z-10 select-none text-[190px] font-extrabold leading-none tracking-[-0.04em] text-guirose-accion/10 lg:text-[300px]"
              >
                {hp}
              </span>
              {imagen}
            </div>

            <div className="ficha-info py-2 lg:py-6 lg:pr-4">
              <div className="flex gap-2">
                <span className="rounded-full bg-guirose-accion px-3 py-1 text-sm font-semibold text-white">
                  {tipoNombre}
                </span>
                <span className="rounded-full border border-guirose-accion px-3 py-1 text-sm font-semibold text-guirose-accion">
                  {linea}
                </span>
              </div>

              <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[44px]">
                Mercury {linea} {hp} HP
              </h1>
              <p className="mt-3 max-w-[560px] text-base text-guirose-texto lg:text-lg">
                {descripcion}
              </p>

              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                {claves.map((c) => (
                  <div
                    key={c.etiqueta}
                    className="border-l-2 border-guirose-accion pl-4"
                  >
                    <dd className="whitespace-nowrap text-lg font-bold text-guirose-marino lg:text-xl">
                      {c.valor}
                    </dd>
                    <dt className="text-sm text-guirose-texto">{c.etiqueta}</dt>
                  </div>
                ))}
              </dl>

              {/* Configurador */}
              <div className="mt-7 max-w-[560px]">
                <fieldset>
                  <legend className="mb-2.5 text-[17px] font-semibold text-guirose.marino">
                    Tipo de mando
                  </legend>
                  <div className="flex gap-2.5 sm:gap-3">
                    {unicos(modelos, "control").map((valor) => (
                      <label
                        key={valor}
                        className="flex flex-1 cursor-pointer touch-manipulation flex-col items-center gap-1.5 rounded-[14px] border-[1.5px] border-guirose-borde bg-white p-2.5 text-guirose-marino transition duration-150 ease-out select-none active:scale-[0.97] hover:border-guirose-accion has-checked:border-guirose-accion has-checked:text-guirose-accion has-checked:ring-1 has-checked:ring-guirose-accion has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-guirose-azul has-disabled:cursor-not-allowed has-disabled:opacity-40 sm:w-[150px] sm:flex-none"
                      >
                        <input
                          type="radio"
                          name="mando"
                          value={valor}
                          checked={valorDe("control") === valor}
                          disabled={!disponible("control", valor)}
                          onChange={() => elegir("control", valor)}
                          className="sr-only"
                        />
                        {FOTO_MANDO[valor] && (
                          <Image
                            src={FOTO_MANDO[valor]}
                            alt=""
                            width={252}
                            height={252}
                            className="h-[90px] w-[100px] object-contain sm:h-[110px] sm:w-[118px]"
                          />
                        )}
                        <span className="text-sm font-semibold">{valor}</span>
                      </label>
                    ))}
                  </div>
                  {unicos(modelos, "control").length === 1 && (
                    <p className="mt-2 text-[13.5px] text-guirose-texto">
                      Única opción para {hp} HP
                    </p>
                  )}
                </fieldset>

                {listas.map(({ campo, titulo, nombre }) => {
                  const valores = unicos(modelos, campo);
                  const id = `opcion-${campo}`;
                  return (
                    <div key={campo} className="mt-5">
                      <label
                        htmlFor={id}
                        className="mb-2.5 block text-[17px] font-semibold text-guirose-marino"
                      >
                        {titulo}
                      </label>
                      <div className="relative">
                        <select
                          id={id}
                          value={valorDe(campo) ?? ""}
                          onChange={(e) => elegir(campo, e.target.value)}
                          className="h-14 w-full cursor-pointer appearance-none rounded-[10px] bg-guirose-marino pr-12 pl-5 text-[17px] font-semibold text-white transition-colors duration-150 hover:bg-[#0F3A63] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul"
                        >
                          {valores.length > 1 && (
                            <option value="">Selecciona</option>
                          )}
                          {valores.map((v) => (
                            <option
                              key={v}
                              value={v}
                              disabled={!disponible(campo, v)}
                            >
                              {nombre(v)}
                              {disponible(campo, v)
                                ? ""
                                : " - no disponible con tu elección"}
                            </option>
                          ))}
                        </select>
                        <CaretDownIcon
                          aria-hidden="true"
                          size={20}
                          weight="bold"
                          className="pointer-events-none absolute top-1/2 right-[18px] -translate-y-1/2 text-white"
                        />
                      </div>
                      {valores.length === 1 && (
                        <p className="mt-2 text-[13.5px] text-guirose-texto">
                          Única opción para {hp} HP
                        </p>
                      )}
                    </div>
                  );
                })}

                <div className="mt-5 flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-[15px] text-guirose-texto">
                    Tu modelo:{" "}
                    <b className="text-[15px] text-guirose-marino">
                      {modelo
                        ? modelo.codigo
                        : `elige ${juntar(faltantes.map((c) => NOMBRE_CORTO[c]))}`}
                    </b>
                  </p>
                  <button
                    type="button"
                    onClick={() => setEleccion({})}
                    className={`min-h-11 touch-manipulation text-sm font-semibold text-guirose-accion underline underline-offset-4 ${
                      CAMPOS.some((c) => eleccion[c] !== undefined)
                        ? ""
                        : "invisible"
                    }`}
                  >
                    Quitar selección
                  </button>
                </div>

                {/* Escritorio */}
                <div className="mt-3 hidden lg:block">
                  <Boton
                    href="#"
                    variante="relleno"
                    className="h-14 w-fit justify-center gap-3 px-6 text-lg font-semibold"
                  >
                    Continuar a equipamiento
                  </Boton>
                </div>

                <p
                  aria-live="polite"
                  className="mt-3 text-sm text-guirose-texto"
                >
                  {faltantes.length === 0
                    ? "Listo, ya puedes continuar"
                    : `Faltan ${faltantes.length} de 3 opciones por elegir`}{" "}
                  *Imagen referencial
                </p>
              </div>
            </div>
          </div>
        </section>

        <FichaTecnica hp={hp} base={base} configuracion={configuracion} />
      </div>

      {children}

      {/* Celular */}
      <div className="sticky bottom-0 z-30 border-t border-guirose-espuma-fuerte bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
        <Boton
          href="#"
          variante="relleno"
          className="h-14 w-full justify-center gap-3 text-lg font-semibold"
        >
          Continuar a equipamiento
        </Boton>
      </div>
    </div>
  );
}
