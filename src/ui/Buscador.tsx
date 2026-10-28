import { MagnifyingGlassIcon } from "@phosphor-icons/react/ssr";

type Sugerencia = { texto: string; href: string };

type PropsBuscador = {
  id: string;
  sugerencias: Sugerencia[];
  className?: string;
};

export default function Buscador({
  id,
  sugerencias,
  className = "",
}: PropsBuscador) {
  return (
    <div role="search" className={`group relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar motores, repuestos o accesorios
      </label>
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-guirose-marino"
      />
      <input
        id={id}
        type="search"
        placeholder="Busca un motor, repuestos o accesorios..."
        className="h-[50px] w-full rounded-full border border-guirose-borde bg-guirose-gris pl-12 pr-4 text-base text-guirose-marino placeholder:text-gray-600 focus:border-guirose-accion focus:bg-white focus:outline-none focus:ring-2 focus:ring-guirose-azul/30"
      />
      {/* Sugerencias: aparecen mientras el cursor está dentro del buscador */}
      <div className="absolute inset-x-0 top-full z-40 mt-2 hidden rounded-xl border border-guirose-borde bg-white p-2.5 shadow-[0_14px_34px_rgba(8,43,76,0.18)] group-focus-within:block">
        <p className="px-2.5 py-1.5 text-sm font-semibold text-gray-600">
          Búsquedas frecuentes
        </p>
        <ul>
          {sugerencias.map((sugerencia) => (
            <li key={sugerencia.texto}>
              <a
                href={sugerencia.href}
                className="block rounded-lg px-2.5 py-3 text-base font-medium text-guirose-marino hover:bg-guirose-espuma active:bg-guirose-espuma"
              >
                {sugerencia.texto}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
