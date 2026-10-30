"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  QuestionIcon,
  ShoppingCartIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";
import { describirCantidad } from "@/contenido/preguntas";
import type { CategoriaPreguntas, IconoCategoria } from "@/contenido/preguntas";
import Desplegable from "./Desplegable";

// Un dibujo por cada ícono
const iconos: Record<IconoCategoria, typeof WrenchIcon> = {
  configuracion: WrenchIcon,
  compra: ShoppingCartIcon,
  general: QuestionIcon,
};

// Ubicacion de cada panel respecto al activo
function posicion(indice: number, activa: number) {
  if (indice === activa) return "activo";
  return indice < activa ? "arriba" : "abajo";
}

export default function PreguntasFrecuentes({
  categorias,
}: {
  categorias: CategoriaPreguntas[];
}) {
  const [activa, setActiva] = useState(0);

  return (
    <div className="grid gap-6 lg:grid-cols-[390px_1fr] lg:items-start lg:gap-14">
      <div
        role="radiogroup"
        aria-label="Categorías de preguntas"
        className="-m-1 flex gap-3 overflow-x-auto p-1 lg:sticky lg:top-32 lg:m-0 lg:flex-col lg:overflow-visible lg:p-0"
      >
        {categorias.map((categoria, indice) => {
          const Icono = iconos[categoria.icono ?? "general"];

          return (
            <label
              key={categoria.id}
              data-activa={indice === activa}
              className="group/tema grid w-[270px] flex-none cursor-pointer grid-cols-[48px_1fr] items-center gap-4 rounded-[18px] border-[1.5px] border-transparent bg-guirose-espuma px-[18px] py-4 transition-[background-color,border-color,box-shadow,transform] duration-[250ms] ease-out active:scale-[0.985] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-guirose-marino not-data-[activa=true]:hover:bg-guirose-espuma-fuerte data-[activa=true]:border-guirose-accion data-[activa=true]:bg-white data-[activa=true]:shadow-[0_16px_32px_-22px_rgba(0,105,217,0.6)] lg:w-auto"
            >
              <input
                type="radio"
                name="categoria-preguntas"
                checked={indice === activa}
                onChange={() => setActiva(indice)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-guirose-accion transition-colors duration-[250ms] ease-out group-data-[activa=true]/tema:bg-guirose-accion group-data-[activa=true]/tema:text-white"
              >
                <Icono className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-lg font-bold leading-tight text-guirose-marino">
                  {categoria.titulo}
                </span>
                <span className="mt-0.5 block text-sm text-guirose-texto">
                  {describirCantidad(categoria.preguntas.length)}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <div className="grid">
        {categorias.map((categoria, indice) => (
          <div
            key={categoria.id}
            data-posicion={posicion(indice, activa)}
            className="pf-panel"
          >
            <div className="pf-clip">
              <div className="flex flex-col gap-3.5">
                {categoria.preguntas.map((item, n) => (
                  <div
                    key={n}
                    className="pf-item"
                    style={{ "--i": n } as CSSProperties}
                  >
                    <Desplegable
                      titulo={item.pregunta}
                      numero={n + 1}
                      abiertoInicial={n === 0}
                    >
                      <p>{item.respuesta}</p>
                    </Desplegable>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
