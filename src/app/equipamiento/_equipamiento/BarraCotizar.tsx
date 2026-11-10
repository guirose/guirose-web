import Boton from "@/ui/Boton";

type Props = {
  href: string;
};

export default function BarraCotizar({ href }: Props) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-guirose-espuma-fuerte bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <Boton
        href={href}
        variante="relleno"
        className="h-14 w-full justify-center gap-3 text-[17px] font-semibold"
      >
        Previsualizar mi cotización
      </Boton>
    </div>
  );
}
