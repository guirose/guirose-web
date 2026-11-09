"use client";

import { useState } from "react";
import type { ItemEquipamiento } from "@/contenido/equipamiento";
import { describirItem, descripcionDetallada } from "@/contenido/accesorios";
import FotoAccesorio from "./FotoAccesorio";

type Props = { items: ItemEquipamiento[] };

const VISIBLES = 8; // los primeros accesorios se ven y el resto en el desplegable

function Tarjeta({ item }: { item: ItemEquipamiento }) {
  const datos = describirItem(item);
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-guirose-espuma-fuerte p-4">
      <FotoAccesorio
        foto={datos.foto}
        className="h-24 w-24 rounded-xl bg-guirose-espuma/40"
      />
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-snug text-guirose-marino">
          {datos.nombre}
          {typeof item.cantidad === "number" && item.cantidad > 1 && (
            <span className="ml-2 text-base font-bold text-guirose-accion">
              ×{item.cantidad}
            </span>
          )}
        </p>
        <p className="mt-1 text-sm leading-snug text-guirose-texto">
          {descripcionDetallada(item)}
        </p>
      </div>
    </li>
  );
}

export default function SeccionOfrece({ items }: Props) {
  const [abierto, setAbierto] = useState(false);
  const visibles = abierto ? items : items.slice(0, VISIBLES);

  return (
    <section
      aria-labelledby="titulo-ofrece"
      className="border-t border-guirose-espuma-fuerte py-8 lg:py-12"
    >
      <h2
        id="titulo-ofrece"
        className="text-[28px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[36px]"
      >
        Lo que ofrece GUIROSE
      </h2>
      <p className="mt-3 max-w-[640px] text-lg text-guirose-texto">
        Repuestos y accesorios que GUIROSE entrega junto con tu Mercury.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((i) => (
          <Tarjeta key={i.descripcion} item={i} />
        ))}
      </ul>

      {items.length > VISIBLES && (
        <button
          type="button"
          aria-expanded={abierto}
          onClick={() => setAbierto((actual) => !actual)}
          className="mt-6 inline-flex min-h-11 touch-manipulation select-none items-center rounded-full border border-guirose-borde px-5 text-base font-semibold text-guirose-marino transition duration-150 ease-out hover:bg-guirose-espuma active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul"
        >
          {abierto
            ? "Ver menos"
            : `Ver todos los ítems incluidos (${items.length})`}
        </button>
      )}
    </section>
  );
}