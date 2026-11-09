import { Fragment, type CSSProperties } from "react";
import { BoatIcon, HeadsetIcon, UserIcon } from "@phosphor-icons/react/ssr";
import AnimarAlVer from "@/ui/AnimarAlVer";

type Paso = {
  titulo: string;
  texto: string;
  icono: typeof BoatIcon;
};

const PASOS: Paso[] = [
  {
    titulo: "1. Confirma tu equipo",
    texto:
      "Selecciona el motor, características y accesorios que se adecuen a tus necesidades.",
    icono: BoatIcon,
  },
  {
    titulo: "2. Déjanos tus datos",
    texto: "Completa la información de contacto y datos de tu embarcación.",
    icono: UserIcon,
  },
  {
    titulo: "3. Recibe asesoría personalizada",
    texto:
      "Nuestro equipo se comunicará contigo para enviarte la mejor propuesta.",
    icono: HeadsetIcon,
  },
];

// Posición en la secuencia: paso 1 = 0, flecha = 1, paso 2 = 2, flecha = 3, paso 3 = 4
const orden = (n: number) => ({ "--i": n }) as CSSProperties;

function Flecha({ posicion }: { posicion: number }) {
  return (
    <li
      aria-hidden="true"
      style={orden(posicion)}
      className="hidden self-center text-guirose-marino lg:block"
    >
      <svg viewBox="0 0 48 16" className="h-4 w-12" fill="none">
        <path
          className="flecha-trazo"
          d="M2 8H44"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          className="flecha-trazo"
          d="M38 2L45 8L38 14"
          pathLength={1}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </li>
  );
}

export default function PasosCotizacion() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-[67px]">
      <section className="mt-8 border-t border-guirose-espuma-fuerte pt-8 pb-12 lg:mt-10 lg:pt-10 lg:pb-16">
        <h2 className="text-[22px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[24px]">
          ¿Qué necesitas para completar tu cotización?
        </h2>

        <AnimarAlVer>
          <ol className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-start lg:gap-4">
            {PASOS.map((paso, i) => {
              const IconoPaso = paso.icono;
              return (
                <Fragment key={paso.titulo}>
                  {i > 0 && <Flecha posicion={2 * i - 1} />}
                  <li
                    style={orden(2 * i)}
                    className="paso-secuencia flex items-start gap-3.5 lg:gap-4"
                  >
                    <span className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-guirose-espuma-fuerte text-guirose-marino lg:h-[68px] lg:w-[68px]">
                      <IconoPaso
                        aria-hidden="true"
                        className="h-7 w-7 lg:h-8 lg:w-8"
                      />
                    </span>
                    <div>
                      <h3 className="text-base font-bold leading-[1.2] text-guirose-marino lg:text-[18px]">
                        {paso.titulo}
                      </h3>
                      <p className="mt-1 text-sm leading-normal text-guirose-texto lg:mt-1.5 lg:text-[15px]">
                        {paso.texto}
                      </p>
                    </div>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </AnimarAlVer>
      </section>
    </div>
  );
}
