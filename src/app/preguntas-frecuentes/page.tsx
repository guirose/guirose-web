import type { Metadata } from "next";
import { QuestionIcon } from "@phosphor-icons/react/ssr";
import CabeceraAyuda from "@/app/_ayuda/CabeceraAyuda";
import PreguntasFrecuentes from "@/ui/PreguntasFrecuentes";
import Boton from "@/ui/Boton";
import { categoriasPreguntas } from "@/contenido/preguntas";
import { ruta } from "@/ruta";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | GUIROSE",
};

export default function PaginaPreguntasFrecuentes() {
  return (
    <>
      <CabeceraAyuda activa="preguntas" />
      <section className="mx-auto max-w-[1440px] px-6 py-8 lg:px-[67px] lg:py-10">
        <header className="mx-auto mb-6 flex max-w-[640px] flex-col items-center gap-2 text-center lg:mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-guirose-espuma text-guirose-accion">
            <QuestionIcon
              aria-hidden="true"
              weight="duotone"
              className="h-7 w-7"
            />
          </span>
          <h2 className="text-2xl font-bold text-guirose-marino lg:text-3xl">
            Resolvemos tus dudas
          </h2>
          <p className="text-base font-semibold text-guirose-accion lg:text-lg">
            Encuentra respuestas a las dudas más comunes sobre tu motor Mercury.
          </p>
        </header>

        <PreguntasFrecuentes categorias={categoriasPreguntas} />
      </section>

      <div className="flex justify-center px-6 pb-10 lg:pb-14">
        <Boton
          href={ruta("/")}
          variante="relleno"
          className="h-12 w-fit gap-3 px-8 text-base font-semibold"
        >
          Volver al inicio
        </Boton>
      </div>
    </>
  );
}
