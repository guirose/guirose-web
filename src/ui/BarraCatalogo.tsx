import { Fragment, type ElementType } from "react";

export type TipoCatalogo = {
  id: string;
  titulo: string;
  cantidad: number;
  href: string;
  activo: boolean;
  potencias: { hp: number; href: string }[];
};

type Props = {
  tipos: TipoCatalogo[];
  enlace?: ElementType;
};

const claseBoton =
  "flex flex-col items-center justify-center rounded-xl px-3 py-3 text-center text-guirose-marino transition-colors duration-200 ease-out active:scale-[0.97] " +
  "not-aria-[current=page]:hover:bg-white aria-[current=page]:bg-guirose-accion aria-[current=page]:text-white " +
  "lg:items-start lg:rounded-2xl lg:px-4 lg:py-3.5 lg:text-left lg:not-aria-[current=page]:hover:bg-guirose-espuma " +
  "lg:aria-[current=page]:bg-guirose-espuma lg:aria-[current=page]:text-guirose-accion lg:aria-[current=page]:ring-1 lg:aria-[current=page]:ring-guirose-accion";

export default function BarraCatalogo({ tipos, enlace: Enlace = "a" }: Props) {
  const activo = tipos.find((t) => t.activo);
  return (
    <nav
      aria-label="Catálogo de motores"
      className="lg:sticky lg:top-40 lg:self-start"
    >
      <h2 className="mb-1 hidden px-4 text-2xl font-bold text-guirose-marino lg:block">
        Catálogo
      </h2>
      <p className="mb-2 hidden px-4 text-[15px] font-bold text-guirose-texto lg:block">
        Motores
      </p>
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-guirose-espuma p-1.5 lg:grid-cols-1 lg:gap-2.5 lg:bg-transparent lg:p-0">
        {tipos.map((t) => (
          <Fragment key={t.id}>
            <Enlace
              href={t.href}
              aria-current={t.activo ? "page" : undefined}
              className={claseBoton}
            >
              <span className="text-base font-bold lg:text-[17px]">
                {t.titulo}
              </span>
              <span className="text-xs lg:text-[13px]">
                {t.cantidad} modelos
              </span>
            </Enlace>
            {/* Vista escritorio: Lista de potencias del tipo activo */}
            {t.activo && (
              <ul className="hidden lg:block lg:pb-2 lg:pt-1">
                {t.potencias.map((p) => (
                  <li key={p.hp}>
                    <a
                      href={p.href}
                      className="block rounded-lg px-4 py-2.5 text-[17px] font-semibold text-guirose-marino transition-colors duration-150 ease-out hover:bg-guirose-espuma active:scale-[0.98]"
                    >
                      {p.hp} HP
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Fragment>
        ))}
      </div>
      {/* Vista movil: Fila de potencias para deslizar */}
      {activo && (
        <ul className="-mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] lg:hidden">
          {activo.potencias.map((p) => (
            <li key={p.hp} className="shrink-0">
              <a
                href={p.href}
                className="flex h-11 min-w-[68px] items-center justify-center rounded-full bg-guirose-espuma px-4 text-base font-bold text-guirose-marino transition active:scale-95 active:bg-guirose-accion active:text-white"
              >
                {p.hp} HP
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
