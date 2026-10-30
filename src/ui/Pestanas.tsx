import { QuestionIcon, ShieldCheckIcon } from "@phosphor-icons/react/ssr";

export type Pestana = {
  texto: string;
  href: string;
  icono: "garantia" | "preguntas";
  activa: boolean;
};

const iconos = {
  garantia: ShieldCheckIcon,
  preguntas: QuestionIcon,
};

export default function Pestanas({ pestanas }: { pestanas: Pestana[] }) {
  return (
    <nav
      aria-label="Centro de ayuda"
      className="mx-auto flex w-full max-w-[640px] gap-1 rounded-[14px] bg-guirose-espuma p-1.5"
    >
      {pestanas.map((pestana) => {
        const Icono = iconos[pestana.icono];

        return (
          <a
            key={pestana.texto}
            href={pestana.href}
            aria-current={pestana.activa ? "page" : undefined}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[10px] px-2 text-[15px] font-semibold text-guirose-texto transition duration-150 ease-out hover:bg-guirose-espuma-fuerte hover:text-guirose-marino active:scale-[0.97] aria-[current=page]:bg-guirose-accion aria-[current=page]:text-white aria-[current=page]:hover:bg-guirose-accion aria-[current=page]:hover:text-white sm:gap-3 sm:text-[19px]"
          >
            <Icono aria-hidden="true" className="hidden h-6 w-6 sm:block" />
            {pestana.texto}
          </a>
        );
      })}
    </nav>
  );
}
