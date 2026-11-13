type Fila = { etiqueta: string; valor: string };

// Ficha técnica para dos columnas en escritorio y una en celular
export default function TablaFicha({ filas }: { filas: Fila[] }) {
  const mitad = Math.ceil(filas.length / 2);
  const columnas = [filas.slice(0, mitad), filas.slice(mitad)];

  return (
    <section
      aria-labelledby="titulo-ficha"
      className="mt-8 border-t border-guirose-espuma-fuerte pt-8"
    >
      <h2
        id="titulo-ficha"
        className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-guirose-marino lg:text-[26px]"
      >
        Ficha técnica
      </h2>
      <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
        {columnas.map((columna, i) => (
          <dl key={i}>
            {columna.map((fila) => (
              <div
                key={fila.etiqueta}
                className="flex items-baseline justify-between gap-4 border-b border-guirose-espuma-fuerte py-2.5"
              >
                <dt className="text-sm text-guirose-texto lg:text-[15px]">
                  {fila.etiqueta}
                </dt>
                <dd className="text-right text-sm font-semibold text-guirose-marino lg:text-[15px]">
                  {fila.valor}
                </dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
    </section>
  );
}