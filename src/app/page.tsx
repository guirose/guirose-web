export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-4xl font-extrabold text-guirose-marino">
        TU PRÓXIMO MOTOR LO ENCUENTRAS AQUÍ
      </h1>
      <h2 className="mt-4 text-2x1 font-bold">Explora Motores Mercury</h2>
      <p className="mt-2 font-semibold">Texto Semibold (botones y menú)</p>
      <p className="mt-1">
        Texto Regular: rendimiento confiable para el trabajo diario en el mar.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <span className="rounded-md bg-guirose-marino px-4 py-2 font-semibold text-white">
          Azul marino
        </span>
        <span className="rounded-md bg-guirose-azul px-4 py-2 font-semibold text-white">
          Azul brillante
        </span>
        <span className="rounded-md bg-guirose-rojo px-4 py-2 font-semibold text-white">
          Rojo
        </span>
        <span className="rounded-md bg-guirose-gris px-4 py-2 font-semibold">
          Gris claro
        </span>
        <span className="rounded-md border border-guirose-borde px-4 py-2 font-semibold">
          Borde gris
        </span>
        <span className="rounded-md bg-guirose-marino/60 px-4 py-2 font-semibold text-white">
          Marino al 60%
        </span>
      </div>
      <div className="h-[2000px]" />
    </main>
  );
}
