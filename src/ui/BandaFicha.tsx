import { CheckCircleIcon } from "@phosphor-icons/react/ssr"

type PropsBandaFicha = {
  beneficios: string[];
  idealPara: string[];
};

const estiloTitulo =
  "text-[22px] font-bold tracking-[-0.02em] text-guirose-marino lg:text-[26px]";

export default function BandaFicha({ beneficios, idealPara }: PropsBandaFicha) {
  return (
    <div className="bg-guirose-espuma">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-10 lg:grid-cols-2 lg:gap-12 lg:px-[67px] lg:py-14">
        <section aria-labelledby="titulo-beneficios">
          <h2 id="titulo-beneficios" className={estiloTitulo}>Beneficios</h2>
          <ul className="mt-4 space-y-3">
            {beneficios.map((texto) => (
              <li key={texto} className="flex items-start gap-3 text-base text-guirose-texto">
                <CheckCircleIcon
                  aria-hidden="true"
                  weight="bold"
                  className="mt-0.5 h-6 w-6 shrink-0 text-guirose-azul"
                />
                {texto}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="titulo-ideal">
          <h2 id="titulo-ideal" className={estiloTitulo}>Ideal para</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {idealPara.map((texto) => (
              <li
                key={texto}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-guirose-marino"
              >
                {texto}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}