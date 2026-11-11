import { CheckIcon } from "@phosphor-icons/react/ssr";

const PASOS = ["Revisa tu equipo", "Déjanos tus datos", "Recibe asesoría"];

type Props = { actual: 1 | 2 | 3 };

export default function IndicadorPasos({ actual }: Props) {
  return (
    <div>
      <ol aria-label="Pasos de la cotización" className="flex items-center">
        {PASOS.map((texto, i) => {
          const n = i + 1;
          const hecho = n < actual;
          const activo = n === actual;
          return (
            <li
              key={texto}
              aria-current={activo ? "step" : undefined}
              className="flex items-center"
            >
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className={`mx-1.5 h-0.5 w-5 sm:mx-2.5 sm:w-6 lg:w-8 ${n <= actual ? "bg-[#1B7F3B]" : "bg-guirose-espuma-fuerte"}`}
                />
              )}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
                  hecho
                    ? "bg-[#1B7F3B] text-white"
                    : activo
                      ? "bg-guirose-accion text-white"
                      : "bg-guirose-espuma-fuerte text-guirose-marino"
                }`}
              >
                {hecho ? (
                  <CheckIcon
                    aria-hidden="true"
                    className="h-[18px] w-[18px]"
                    weight="bold"
                  />
                ) : (
                  n
                )}
              </span>
              <span
                className={`ml-2.5 whitespace-nowrap text-base font-semibold ${
                  activo || hecho ? "text-guirose-marino" : "text-[#4B5D70]"
                } ${activo ? "max-[359px]:hidden" : "hidden sm:inline"}`}
              >
                {texto}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 hidden text-base font-semibold text-guirose-marino max-[359px]:block">
        {PASOS[actual - 1]}
      </p>
    </div>
  );
}