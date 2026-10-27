type Enlace = { texto: string; href: string };

type PropsPieDePagina = {
  catalogo: Enlace[];
  privacidad: Enlace[];
};

const estiloEnlace =
  "underline-offset-4 transition-colors hover:underline focus-visible:underline";

export default function PieDePagina({
  catalogo,
  privacidad,
}: PropsPieDePagina) {
  return (
    <footer className="bg-guirose-marino text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-y-10 px-6 py-[42px] lg:grid-cols-[1.4fr_1.3fr_1.4fr_1fr] lg:gap-y-0 lg:px-[88px]">
        {/* Logo: texto provisional hasta tener el archivo */}
        <a
          href="/"
          className="text-4xl font-extrabold tracking-tight text-white lg:self-center"
        >
          GUIROSE
        </a>

        {/* Catálogo */}
        <nav
          aria-label="Catálogo"
          className="border-l-2 border-guirose-borde pl-6 lg:min-h-[150px]"
        >
          <h2 className="mb-7 text-[15px] font-semibold">Catálogo</h2>
          <ul className="text-base leading-[25px]">
            {catalogo.map((enlace) => (
              <li key={enlace.texto}>
                <a href={enlace.href} className={estiloEnlace}>
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contacto: texto provisional, faltan teléfono, correo y redes */}
        <div className="border-l-2 border-guirose-borde pl-6 lg:min-h-[150px]">
          <h2 className="mb-7 text-[15px] font-semibold">Contacto</h2>
          <p className="text-base leading-[25px]">
            Visita nuestras redes, contáctanos y recibe asesoría para tu
            embarcación
          </p>
        </div>

        {/* Privacidad */}
        <nav
          aria-label="Privacidad"
          className="border-l-2 border-guirose-borde pl-6 lg:min-h-[150px]"
        >
          <h2 className="mb-7 text-[15px] font-semibold">Privacidad</h2>
          <ul className="text-base leading-[25px]">
            {privacidad.map((enlace) => (
              <li key={enlace.texto}>
                <a href={enlace.href} className={estiloEnlace}>
                  {enlace.texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
