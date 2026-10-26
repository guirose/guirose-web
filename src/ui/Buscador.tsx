import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";

type PropsBuscador = {
  id: string;
  className?: string;
};

export default function Buscador({ id, className = "" }: PropsBuscador) {
  return (
    <div role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar productos
      </label>
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-guirose-marino"
      />
      <input
        id={id}
        type="search"
        placeholder="Busca un motor, repuestos o accesorios..."
        className="h-full w-full rounded-md border border-guirose-marino bg-guirose-gris px-14 text-center text-lg italic placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-guirose-azul"
      />
    </div>
  );
}
