import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react/ssr";
import Boton from "@/ui/Boton";

type Props = {
  codigo: string;
  configuracion: string[];
  hrefEquipamiento: string;
  hrefCambiar?: string;
  mandoUnico?: string;
};

export default function TarjetaModelo({
  codigo,
  configuracion,
  hrefEquipamiento,
  hrefCambiar,
  mandoUnico,
}: Props) {
  return (
    <section
      aria-labelledby="titulo-modelo"
      className="mt-8 rounded-2xl bg-guirose-espuma p-5 sm:p-6"
    >
      <h2 id="titulo-modelo" className="text-sm text-guirose-texto">
        Tu modelo
      </h2>
      <p className="text-[28px] font-bold leading-tight tracking-[-0.01em] text-guirose-marino">
        {codigo}
      </p>
      <ul aria-label="Configuracion" className="mt-3 flex flex-wrap gap-2">
        {configuracion.map((texto) => (
          <li
            key={texto}
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-guirose-marino"
          >
            {texto}
          </li>
        ))}
      </ul>

      {/* Celular */}
      <div className="mt-5 hidden lg:block">
        <Boton
          href={hrefEquipamiento}
          variante="relleno"
          className="h-14 w-full justify-center gap-3 text-lg font-semibold"
        >
          Continuar a equipamiento
        </Boton>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="flex items-center gap-2 text-[15px] font-semibold text-[#1B7F3B]">
          <CheckCircleIcon aria-hidden="true" weight="fill" className="h-5 w-5" />
          Listo, ya puedes continuar.
        </p>
        {hrefCambiar ? (
          <a
            href={hrefCambiar}
            className="inline-flex min-h-11 items-center gap-1.5 text-base font-semibold text-guirose-accion underline underline-offset-4 hover:text-guirose-marino"
          >
            <ArrowCounterClockwiseIcon
              aria-hidden="true"
              className="h-[18px] w-[18px]"
            />
            Cambiar mando
          </a>
        ) : (
          mandoUnico && (
            <p className="text-[15px] text-guirose-texto">
              Este motor viene solo con {mandoUnico.toLowerCase()}.
            </p>
          )
        )}
      </div>
    </section>
  );
}