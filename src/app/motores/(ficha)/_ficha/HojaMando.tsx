import Image from "next/image";
import { ArrowRightIcon } from "@phosphor-icons/react/ssr";
import BarraFicha from "@/ui/BarraFicha";
import PasosCotizacion from "@/ui/PasosCotizacion";
import {
  infoTipo,
  ofrecidas,
  rutaDe,
  rutaModelo,
  vecinosDe,
  type Control,
  type Motor,
  type TipoMotor,
} from "@/contenido/motores";
import { ruta } from "@/ruta";
import BannerFicha from "./BannerFicha";

const MANDO: Record<Control, { foto: string; alt: string; texto: string }> = {
  "Mando popero": {
    foto: "/imagenes/mandos/mando-popero.jpg",
    alt: "Caña de mando popero",
    texto: "Se maneja desde el motor, con la caña.",
  },
  "Control remoto": {
    foto: "/imagenes/mandos/mando-remoto.jpg",
    alt: "Palanca de control remoto",
    texto: "Se maneja desde el timón, con palanca y cables.",
  },
};

const ORDEN: Control[] = ["Mando popero", "Control remoto"];

const COLOR_TIPO: Record<TipoMotor, string> = {
  "2-tiempos": "bg-guirose-rojo",
  "4-tiempos": "bg-guirose-accion",
};

// el cliente elige el mando
export default function HojaMando({ motor }: { motor: Motor }) {
  const tipo = motor.tipo;
  const info = infoTipo[tipo];
  const { anterior, siguiente } = vecinosDe(motor);
  const modelos = [...ofrecidas(motor)].sort(
    (a, b) => ORDEN.indexOf(a.control) - ORDEN.indexOf(b.control),
  );
  const { altura, inclinacion } = modelos[0];

  return (
    <>
      <BannerFicha />

      <div className="mx-auto max-w-[1440px] px-6 pb-10 lg:px-[67px] lg:pb-12">
        <BarraFicha
          migas={[
            { texto: "Motores", href: ruta("/motores") },
            { texto: info.nombre, href: ruta(`/motores/${tipo}`) },
            { texto: `${motor.hp} HP` },
          ]}
          anterior={
            anterior && {
              texto: `${anterior.hp} HP`,
              href: ruta(rutaDe(anterior)),
            }
          }
          siguiente={
            siguiente && {
              texto: `${siguiente.hp} HP`,
              href: ruta(rutaDe(siguiente)),
            }
          }
        />

        <div className="flex gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${COLOR_TIPO[tipo]}`}
          >
            {info.nombre}
          </span>
          <span className="rounded-full border border-guirose-accion px-3 py-1 text-sm font-semibold text-guirose-accion">
            {motor.linea}
          </span>
        </div>
        <h1 className="mt-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-guirose-marino lg:text-[44px]">
          Mercury {motor.linea} {motor.hp} HP
        </h1>
        <p
          id="pregunta-mando"
          className="mt-2 text-lg text-guirose-texto lg:text-xl"
        >
          ¿Cómo vas a manejar tu motor? Mira las fotos y elige una opción.
        </p>

        {/* cada tarjeta entera es el enlace a la hoja de ese modelo */}
        <ul
          aria-labelledby="pregunta-mando"
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:gap-6"
        >
          {modelos.map((v) => {
            const m = MANDO[v.control];
            return (
              <li key={v.codigo}>
                <a
                  href={ruta(rutaModelo(motor, v))}
                  className="group flex h-full touch-manipulation flex-col overflow-hidden rounded-[20px] border-2 border-guirose-espuma-fuerte bg-white transition duration-150 ease-out hover:border-guirose-accion hover:shadow-[0_8px_24px_rgba(8,43,76,0.08)] active:scale-[0.985] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-guirose-azul"
                >
                  <span className="relative block h-[200px] bg-[#F5FAFF] lg:h-[280px]">
                    <Image
                      src={m.foto}
                      alt={m.alt}
                      fill
                      sizes="(min-width: 640px) 45vw, 90vw"
                      className="object-contain p-3 mix-blend-multiply"
                    />
                  </span>
                  <span className="flex items-center justify-between gap-3 p-4 lg:px-6 lg:py-5">
                    <span>
                      <span className="block text-[21px] font-bold leading-tight text-guirose-marino lg:text-[26px]">
                        {v.control}
                      </span>
                      <span className="mt-1 block text-[15px] leading-snug text-guirose-texto lg:text-[17px]">
                        {m.texto}
                      </span>
                    </span>
                    <span className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-guirose-espuma px-4 text-base font-semibold text-guirose-accion transition-colors duration-150 group-hover:bg-guirose-accion group-hover:text-white lg:h-[52px] lg:px-5 lg:text-[17px]">
                      Elegir
                      <ArrowRightIcon aria-hidden="true" className="h-5 w-5" />
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 max-w-[760px] text-[15px] leading-relaxed text-[#4B5D70] lg:text-base">
          Al elegir el mando pasas a la página de tu modelo, con su ficha
          técnica y el botón para continuar a equipamiento. Para pesca
          artesanal, el {motor.hp} HP va con cola de {altura}″ y elevación{" "}
          {inclinacion.toLowerCase()}. *Imágenes referenciales.
        </p>
      </div>

      <PasosCotizacion />
    </>
  );
}
