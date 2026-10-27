import { FileTextIcon } from "@phosphor-icons/react/ssr";

type PropsBotonCotizacion = {
  cantidad: number;
  className?: string;
};

export default function BotonCotizacion({
  cantidad,
  className = "",
}: PropsBotonCotizacion) {
  return (
    <a
      href="#"
      className={`group flex items-center justify-center gap-3 rounded-md border-2 border-guirose-azul bg-white px-6 text-lg font-semibold text-guirose-azul transition duration-150 ease-out hover:bg-guirose-azul hover:text-white active:scale-[0.97] ${className}`}
    >
      <FileTextIcon
        aria-hidden="true"
        className="h-7 w-7 text-guirose-marino transition duration-150 ease-out group-hover:text-white"
      />
      Mi cotización ({cantidad})
    </a>
  );
}
