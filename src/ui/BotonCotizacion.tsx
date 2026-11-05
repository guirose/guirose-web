import { FileTextIcon } from "@phosphor-icons/react/ssr";

type PropsBotonCotizacion = {
  cantidad: number;
  compacto?: boolean;
  className?: string;
};

export default function BotonCotizacion({
  cantidad,
  compacto = false,
  className = "",
}: PropsBotonCotizacion) {
  const etiqueta = `Mi cotización, ${cantidad} ${cantidad === 1 ? "producto" : "productos"}`;

  return (
    <a
      href="#"
      aria-label={etiqueta}
      className={`group flex items-center gap-2.5 rounded-full border-2 border-guirose-accion bg-white py-0 ${compacto ? "pl-3.5" : "pl-5"} pr-2.5 text-base font-semibold text-guirose-accion transition duration-150 ease-out hover:bg-guirose-accion hover:text-white active:scale-[0.97] ${className}`}
    >
      <FileTextIcon aria-hidden="true" className="h-[22px] w-[22px]" />
      <span className={compacto ? "sr-only" : undefined}>Mi cotización</span>
      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-guirose-accion px-1.5 text-[15px] font-bold text-white transition-colors duration-150 group-hover:bg-white group-hover:text-guirose-accion">
        {cantidad}
      </span>
    </a>
  );
}
