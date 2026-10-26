import Buscador from "./Buscador";
import BotonCotizacion from "./BotonCotizacion";

type EnlaceMenu = { texto: string; href: string };

type PropsEncabezado = {
  enlaces: EnlaceMenu[];
  cantidadCotizacion: number;
};

export default function Encabezado({
  enlaces,
  cantidadCotizacion,
}: PropsEncabezado) {
  return (
    <header className="bg-white">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-x-12 gap-y-4 px-6 py-5 lg:grid-cols-[230px_1fr_auto] lg:px-[70px]">
        {/* Logo: texto provisional hasta tener el archivo */}
        <a
          href="/"
          className="text-4xl font-extrabold tracking-tight text-guirose-marino transition-opacity hover:opacity-80 lg:row-span-2 lg:self-center lg:text-center"
        >
          GUIROSE
        </a>

        <Buscador id="buscador" className="h-[60px]" />

        <BotonCotizacion cantidad={cantidadCotizacion} className="h-[60px]" />

        <nav aria-label="Principal" className="lg:col-start-2">
          <ul className="flex flex-wrap gap-x-12 gap-y-2 text-base font-semibold uppercase text-guirose-marino">
            {enlaces.map((enlace) => (
              <li key={enlace.texto}>
                <a
                  href={enlace.href}
                  className="decoration-2 underline-offset-8 transition-colors hover:text-guirose-azul hover:underline focus-visible:underline"
                >
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
