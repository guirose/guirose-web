import Boton from "./Boton";

type PropsBandaComunidad = {
  id?: string;
  titulo: string;
  descripcion: string;
  textoBoton: string;
  hrefBoton: string;
};

export default function BandaComunidad({
  id,
  titulo,
  descripcion,
  textoBoton,
  hrefBoton,
}: PropsBandaComunidad) {
  return (
    <section
      id={id}
      className="mx-auto max-w-[1440px] scroll-mt-28 px-6 pb-16 lg:px-[67px] lg:pb-20"
    >
      <div className="flex flex-col items-start gap-6 rounded-xl bg-guirose-marino px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-10 lg:px-12 lg:py-9">
        <div>
          <h2 className="text-[26px] font-bold leading-[1.15] tracking-[-0.02em] lg:text-[32px]">
            {titulo}
          </h2>
          <p className="mt-2.5 text-base text-white/80 lg:text-[19px]">
            {descripcion}
          </p>
        </div>

        <Boton
          href={hrefBoton}
          variante="relleno"
          className="h-14 shrink-0 gap-3.5 px-7 text-lg font-semibold"
        >
          {textoBoton}
        </Boton>
      </div>
    </section>
  );
}