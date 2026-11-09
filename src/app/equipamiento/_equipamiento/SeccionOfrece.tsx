import type { ItemEquipamiento } from "@/contenido/equipamiento";
import { describirItem } from "@/contenido/accesorios";
import FotoAccesorio from "./FotoAccesorio";

type Props = { items: ItemEquipamiento[] };

const VISIBLES = 8; // los primeros accesorios se ven y el resto en el desplegable

function Tarjeta({ item }: { item: ItemEquipamiento }) {
  const datos = describirItem(item);
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-guirose-espuma-fuerte p-4">
      <FotoAccesorio foto={datos.foto} className="h-20 w-20 bg-guirose-espuma/40" />
      <p className="text-lg font-semibold leading-snug text-guirose-marino">
        {datos.nombre}
        {typeof item.cantidad === "number" && item.cantidad > 1 && (
          <span className="ml-2 text-base font-bold text-guirose-accion">
            x{item.cantidad}
          </span>
        )}
      </p>
    </li>
  );
}

export default function SeccionOfrece({ items }: Props) {
  const primeros = items.slice(0, VISIBLES);
  const resto = items.slice(VISIBLES);

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
        Repuestos y accesorios que GUIROSE entrega junto con tu Mercury
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primeros.map((i) => (
          <Tarjeta key={i.descripcion} item={i} />
        ))}
      </ul>

      {resto.length > 0 && (
        <details className="group mt-5">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center rounded-full border border-guirose-borde px-5 text-base font-semibold text-guirose-marino transition duration-150 ease-out hover:bg-guirose-espuma active:scale-[0.97]">
            <span className="group-open:hidden">
              Ver todos los ítems incluidos ({items.length})
            </span>
            <span className="hidden group-open:inline">Ver menos</span>
          </summary>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {resto.map((i) => (
              <Tarjeta key={i.descripcion} item={i} />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}