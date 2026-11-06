import { CheckCircleIcon } from "@phosphor-icons/react/ssr";

type PropsBandaFicha = {
  beneficios: string[];
  idealPara: string[];
};

const estiloBloque = "mt-10 border-t border-guirose-espuma-fuerte pt-8";

const estiloTitulo =
  "text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[26px]";

export default function BandaFicha({ beneficios, idealPara }: PropsBandaFicha) {
  return (
    <>
      <section aria-labelledby="titulo-beneficios" className={estiloBloque}>
        <h2 id="titulo-beneficios" className={estiloTitulo}>
          Beneficios
        </h2>
        <ul className="mt-4 space-y-3">
          {beneficios.map((texto) => (
            <li
              key={texto}
              className="flex items-start gap-3 text-base text-guirose-texto lg:text-[17px]"
            >
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

      <section aria-labelledby="titulo-ideal" className={estiloBloque}>
        <h2 id="titulo-ideal" className={estiloTitulo}>
          Ideal para
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {idealPara.map((texto) => (
            <li
              key={texto}
              className="rounded-full bg-guirose-espuma px-4 py-2 text-sm font-semibold text-guirose-marino lg:text-[15px]"
            >
              {texto}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
