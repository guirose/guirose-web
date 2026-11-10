import Boton from "@/ui/Boton";

type Props = {
  href: string;
};

export default function FranjaCotizar({ href }: Props) {
  return (
    <section
      aria-labelledby="titulo-listo"
      className="hidden bg-guirose-marino text-white lg:block"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center gap-8 px-[67px] py-9">
        <div>
          <h2 id="titulo-listo" className="text-[26px] leading-tight font-bold">
            ¿Listo con tu equipamiento?
          </h2>
          <p className="mt-2 text-lg text-[#DCE7F2]">
            Sigue al siguiente paso y recibe tu cotización.
          </p>
        </div>

        <Boton
          href={href}
          variante="relleno"
          className="h-[60px] justify-center gap-3 px-8 text-lg font-semibold"
        >
          Previsualizar mi cotización
        </Boton>
      </div>
    </section>
  );
}
