import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import { ruta } from "@/ruta";
import { botonPrincipal } from "./estilos";

// se muestra si no hay nada guardado aún
export default function Vacio() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-[67px] lg:py-24">
      <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em] text-guirose-marino lg:text-[36px]">
        Aún no elegiste tu equipo
      </h1>
      <p className="mt-3 max-w-[560px] text-lg text-guirose-texto">
        Elige un motor y sus accesorios para ver aquí el resumen de tu
        cotización.
      </p>
      <a
        href={ruta("/motores")}
        className={`${botonPrincipal} mt-8 max-w-[320px]`}
      >
        Ver motores
        <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
      </a>
    </div>
  );
}