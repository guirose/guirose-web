import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/ssr";

type Miga = { texto: string; href?: string };
type Vecino = { texto: string; href: string };

type PropsBarraFicha = {
  migas: Miga[];
  anterior?: Vecino;
  siguiente?: Vecino;
};

const estiloVecino = "flex min-h-11 items-center justify-center gap-1 rounded-full border border-guirose-borde px-4 text-sm font-semibold text-guirose-marino transition duration-150 ease-out hover:bg-guirose-espuma active:scale-[0.97]";

export default function BarraFicha({
  migas,
  anterior,
  siguiente,
}: PropsBarraFicha) {
  return (
    <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between lg:py-6">
      <nav aria-label="Ruta">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-guirose-texto">
          {migas.map((miga, i) => (
            <li key={miga.texto} className="flex items-center gap-1">
              {i > 0 && (
                <CaretRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              {miga.href ? (
                <a href={miga.href} className="hover:text-guirose-accion hover:underline">
                  {miga.texto}
                </a>
              ) : (
                <span aria-current="page" className="font-semibold text-guirose-marino">
                  {miga.texto}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <nav
        aria-label="Otras potencias"
        className="grid grid-cols-2 gap-2 lg:flex"
      >
        {anterior ? (
          <a href={anterior.href} className={estiloVecino}>
            <CaretLeftIcon aria-hidden="true" className="h-4 w-4" />
            {anterior.texto}
          </a>
        ) : (
          <span aria-hidden="true" />
        )}
        {siguiente ? (
          <a href={siguiente.href} className={estiloVecino}>
            {siguiente.texto}
            <CaretRightIcon aria-hidden="true" className="h-4 w-4" />
          </a>
        ) : (
          <span aria-hidden="true" />
        )}
      </nav>
    </div>
  );
}