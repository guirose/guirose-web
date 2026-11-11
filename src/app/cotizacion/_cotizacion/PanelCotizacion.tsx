import type { ReactNode } from "react";
import { CheckIcon } from "@phosphor-icons/react/ssr";
import type { ResumenCotizacion } from "@/cotizacion/resolver";
import { plural } from "./estilos";

// texto para celular
export function textoCorto(r: ResumenCotizacion): string {
  return [
    r.variante.codigo,
    r.extConsultar
      ? "extensiones por consultar"
      : r.totalExtensiones > 0
        ? plural(r.totalExtensiones, "extensión", "extensiones")
        : undefined,
    r.opcionales.length > 0
      ? plural(r.opcionales.length, "accesorio", "accesorios")
      : undefined,
  ]
    .filter(Boolean).join(" - ");
}

type Props = {
  resumen: ResumenCotizacion;
  className?: string;
  titulo?: boolean;
  children?: ReactNode;
};

// resumen de la cotizacion
export default function PanelCotizacion({
  resumen,
  className = "",
  titulo = true,
  children,
}: Props) {
  const { motor, variante, medidas, medidasElegidas } = resumen;
  const todasLasMedidas = medidasElegidas === medidas.length;

  const filas: { etiqueta: string; valor: ReactNode }[] = [
    { etiqueta: "Motor", valor: `${motor.linea} ${motor.hp} HP` },
    { etiqueta: "Modelo", valor: variante.codigo },
    {
      etiqueta: "Medidas",
      valor: (
        <span className="inline-flex items-center gap-2">
          {todasLasMedidas && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1B7F3B] text-white">
              <CheckIcon aria-hidden="true" className="h-3 w-3" weight="bold" />
            </span>
          )}
          {medidasElegidas} de {medidas.length}
        </span>
      ),
    },
    {
      etiqueta: "Extensiones de arnés",
      valor: resumen.extConsultar
        ? "Por consultar"
        : resumen.totalExtensiones > 0
          ? resumen.totalExtensiones
          : "Ninguna",
    },
    {
      etiqueta: "Accesorios agregados",
      valor:
        resumen.opcionales.length > 0 ? resumen.opcionales.length : "Ninguno",
    },
    {
      etiqueta: "Incluido por GUIROSE",
      valor: plural(resumen.totalIncluidos, "ítem", "ítems"),
    },
  ];

  return (
    <aside
      aria-label="Resumen de tu cotización"
      className={`rounded-2xl border border-guirose-espuma-fuerte bg-guirose-espuma p-6 ${className}`}
    >
      {titulo && (
        <h2 className="text-2xl font-bold text-guirose-marino">
          Tu cotización
        </h2>
      )}
      <dl className={titulo ? "mt-3" : ""}>
        {filas.map((fila) => (
          <div
            key={fila.etiqueta}
            className="flex items-center justify-between gap-4 border-b border-guirose-espuma-fuerte py-3 last:border-b-0"
          >
            <dt className="text-base text-guirose-texto">{fila.etiqueta}</dt>
            <dd className="text-right text-base font-bold text-guirose-marino">
              {fila.valor}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </aside>
  );
}