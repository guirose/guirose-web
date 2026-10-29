import {
  CaretDownIcon,
  ChatCircleTextIcon,
  EngineIcon,
  ShieldCheckIcon,
  WrenchIcon,
} from "@phosphor-icons/react/ssr";

type OpcionSubmenu = { texto: string; descripcion: string; href: string };

export type EnlaceMenu = {
  texto: string;
  href: string;
  icono: "motores" | "repuestos" | "servicios" | "contacto";
  actual?: boolean;
  submenu?: OpcionSubmenu[];
  enlaceFinal?: { texto: string; href: string };
};

const iconos = {
  motores: EngineIcon,
  repuestos: WrenchIcon,
  servicios: ShieldCheckIcon,
  contacto: ChatCircleTextIcon,
};

const clasesEnlace =
  "flex h-11 items-center gap-2 rounded-full px-3.5 text-base font-semibold text-guirose-marino transition duration-150 ease-out hover:bg-white hover:text-guirose-accion active:scale-[0.97] aria-[current=page]:bg-white aria-[current=page]:text-guirose-accion";

export default function MenuPrincipal({ enlaces }: { enlaces: EnlaceMenu[] }) {
  return (
    <nav aria-label="Principal">
      <ul className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
        {enlaces.map((enlace) => {
          const Icono = iconos[enlace.icono];

          return (
            <li key={enlace.texto} className="group/item relative">
              <a
                href={enlace.href}
                aria-current={enlace.actual ? "page" : undefined}
                className={clasesEnlace}
              >
                <Icono aria-hidden="true" className="h-[19px] w-[19px]" />
                {enlace.texto}
                {enlace.submenu && (
                  <CaretDownIcon
                    aria-hidden="true"
                    weight="bold"
                    className="h-3 w-3 transition-transform duration-200 ease-out group-hover/item:rotate-180 group-focus-within/item:rotate-180"
                  />
                )}
              </a>

              {enlace.submenu && (
                <div className="absolute left-0 top-full z-40 hidden w-[300px] pt-2.5 group-hover/item:block group-focus-within/item:block">
                  <div className="rounded-xl border border-guirose-borde bg-white p-2 shadow-[0_14px_34px_rgba(8,43,76,0.18)]">
                    {enlace.submenu.map((opcion) => (
                      <a
                        key={opcion.texto}
                        href={opcion.href}
                        className="block rounded-lg px-3.5 py-3 hover:bg-guirose-espuma active:bg-guirose-espuma"
                      >
                        <span className="block text-base font-semibold text-guirose-marino">
                          {opcion.texto}
                        </span>
                        <span className="mt-0.5 block text-sm text-gray-600">
                          {opcion.descripcion}
                        </span>
                      </a>
                    ))}
                    {enlace.enlaceFinal && (
                      <a
                        href={enlace.enlaceFinal.href}
                        className="mt-1 block border-t border-guirose-borde px-3.5 pb-2 pt-3 text-[15px] font-semibold text-guirose-accion hover:underline"
                      >
                        {enlace.enlaceFinal.texto}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
