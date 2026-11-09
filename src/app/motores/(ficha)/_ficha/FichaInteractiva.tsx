"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Boton from "@/ui/Boton";
import AnimarAlVer from "@/ui/AnimarAlVer";
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

const DETALLE_COLA: Record<string, string> = {
  "15″": "Cola corta",
  "20″": "Cola larga",
  "25″": "Cola extra larga",
};

const DETALLE_ELEVACION: Record<string, string> = {
  Eléctrica: "Power Trim",
};

const DETALLE_MANDO: Record<string, string> = {
  "Mando popero": "Se maneja desde el motor",
  "Control remoto": "Se maneja desde la consola"
}

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
  lista.length <= 1
    ? (lista[0] ?? "")
    : `${lista.slice(0, -1).join(", ")} y ${lista[lista.length - 1]}`;

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

  // tocar otra vez la opcion que ya se eligió la quita
  const quitarSiYaEstaba = (campo: Campo, valor: string) => {
    if (eleccion[campo] === valor) elegir(campo, "");
  };

  const faltantes = CAMPOS.filter((c) => valorDe(c) === undefined);
  const modelo =
    faltantes.length === 0
      ? candidatos.find((m) => CAMPOS.every((c) => m[c] === valorDe(c)))
      : undefined;

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
  const preguntas = [
    {
      campo: "alturaCorta" as const,
      titulo: "Longitud de cola",
      detalle: DETALLE_COLA,
    },
    {
      campo: "inclinacion" as const,
      titulo: "Tipo de elevación",
      detalle: DETALLE_ELEVACION,
    },
  ];

  const opcionBase =
    "cursor-pointer touch-manipulation border-[1.5px] border-guirose-borde bg-white text-guirose-marino transition duration-150 ease-out select-none active:scale-[0.97] hover:border-guirose-accion has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-guirose-azul has-disabled:cursor-not-allowed has-disabled:opacity-40";

  return (
    <div>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-[67px]">
        {barra}

        <AnimarAlVer className="mt-4 grid gap-6 pb-12 lg:grid-cols-2 lg:items-start lg:gap-14 lg:pb-20">
          {/* foto fija al bajar */}
          <div className="rounded-[28px] bg-guirose-espuma p-4 sm:p-5 lg:sticky lg:top-40">
            <div className="relative isolate flex items-center justify-center overflow-hidden rounded-2xl bg-white px-4 py-8 lg:h-[min(620px,calc(100vh-13rem))] lg:py-6">
              <span
                aria-hidden="true"
                className="ficha-numero pointer-events-none absolute -bottom-[0.12em] -left-[0.04em] -z-10 select-none text-[190px] font-extrabold leading-none tracking-[-0.04em] text-guirose-accion/10 lg:text-[300px]"
              >
                {hp}
              </span>
              {imagen}
            </div>
            <p className="mt-3 px-1 text-[13px] text-guirose-texto">
              *Imagen referencial.
            </p>
          </div>

          {/* Contenido que se desplaza */}
          <div className="ficha-info min-w-0 lg:pt-2">
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

            {/* Configuracion */}
            <section
              aria-labelledby="titulo-configura"
              className="mt-8 border-t border-guirose-espuma-fuerte pt-8"
            >
              <h2
                id="titulo-configura"
                className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[28px]"
              >
                Configura motor
              </h2>
              <fieldset className="mt-6">
                <legend className="mb-3 text-[17px] font-semibold text-guirose-marino">
                  Tipo de mando
                </legend>
                <div className="grid grid-cols-2 gap-3">
                  {unicos(modelos, "control").map((valor) => (
                    <label
                      key={valor}
                      className={`${opcionBase} flex flex-col items-center gap-2 rounded-2xl p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left has-checked:border-guirose-accion has-checked:bg-guirose-espuma/50 has-checked:text-guirose-accion has-checked:ring-1 has-checked:ring-guirose-accion`}
                    >
                      <input
                        type="radio"
                        name="control"
                        value={valor}
                        checked={valorDe("control") === valor}
                        disabled={!disponible("control", valor)}
                        onChange={() => elegir("control", valor)}
                        onClick={() => quitarSiYaEstaba("control", valor)}
                        className="sr-only"
                      />
                      {FOTO_MANDO[valor] && (
                        <Image
                          src={FOTO_MANDO[valor]}
                          alt=""
                          width={252}
                          height={252}
                          className="h-20 w-20 shrink-0 rounded-xl bg-white object-contain sm:h-24 sm:w-24"
                        />
                      )}
                      <span>
                        <span className="block text-base font-semibold leading-tight sm:text-lg">
                          {valor}
                        </span>
                        <span className="mt-1 block text-[13px] leading-snug text-guirose-texto sm:text-sm">
                          {DETALLE_MANDO[valor]}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
                {unicos(modelos, "control").length === 1 && (
                  <p className="mt-2 text-sm text-guirose-texto">
                    Única opción para {hp} HP
                  </p>
                )}
              </fieldset>

              {preguntas.map(({ campo, titulo, detalle }) => {
                const valores = unicos(modelos, campo);
                return (
                  <fieldset key={campo} className="mt-6">
                    <legend className="mb-3 text-[17px] font-semibold text-guirose-marino">
                      {titulo}
                    </legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {valores.map((valor) => (
                        <label
                          key={valor}
                          className={`${opcionBase} group flex min-h-[72px] flex-col justify-center rounded-xl px-5 py-3 has-checked:border-guirose-marino has-checked:bg-guirose-marino has-checked:text-white`}
                        >
                          <input
                            type="radio"
                            name={campo}
                            value={valor}
                            checked={valorDe(campo) === valor}
                            disabled={!disponible(campo, valor)}
                            onChange={() => elegir(campo, valor)}
                            onClick={() => quitarSiYaEstaba(campo, valor)}
                            className="sr-only"
                          />
                          <span className="text-lg font-bold leading-tight">
                            {valor}
                          </span>
                          {detalle[valor] && (
                            <span className="mt-0.5 text-[13px] leading-tight text-guirose-texto group-has-checked:text-white/75">
                              {detalle[valor]}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                    {valores.length === 1 && (
                      <p className="mt-2 text-sm text-guirose-texto">
                        Única opción para {hp} HP
                      </p>
                    )}
                  </fieldset>
                );
              })}

              {/* Resumen */}
              <div className="mt-8 rounded-2xl bg-guirose-espuma p-5 sm:p-6">
                <p className="text-sm text-guirose-texto">Tu modelo</p>
                <p
                  aria-live="polite"
                  className={
                    modelo
                      ? "text-[28px] font-bold leading-tight tracking-[-0.01em] text-guirose-marino"
                      : "mt-1 text-lg font-semibold text-guirose-marino"
                  }
                >
                  {modelo
                    ? modelo.codigo
                    : `Elige ${juntar(faltantes.map((c) => NOMBRE_CORTO[c]))}`}
                </p>
                <div className="mt-4 hidden lg:block">
                  <Boton
                    href="#"
                    variante="relleno"
                    className="h-14 w-full justify-center gap-3 text-lg font-semibold"
                  >
                    Continuar a equipamiento
                  </Boton>
                </div>

                <p className="mt-3 text-sm text-guirose-texto">
                  {faltantes.length === 0
                    ? "Listo, ya puedes continuar."
                    : `Faltan ${faltantes.length} de 3 opciones por elegir.`}
                </p>
              </div>
            </section>

            <FichaTecnica hp={hp} base={base} configuracion={configuracion} />

            {children}
          </div>
        </AnimarAlVer>
      </div>

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