import { IconoMensaje, IconoUbicacion } from "./iconos";

export default function BarraSuperior() {
    return (
        <div className="bg-guirose-marino text-white">
            <div className="mx-auto flex max-w-[1300px] items-center justify-between px-6 py-3 text-xs font-bold uppercase sm:text-sm lg:px-[88px]">
                <p className="flex items-center gap-2">
                    <IconoMensaje className="h-5 w-5 shrink-0" />
                    Asesoría para tu embarcación
                </p>
                <p className="flex items-center gap-2">
                    <IconoUbicacion className="h-5 w-5 shrink-0" />
                    Envíos a todo el Perú
                </p>
            </div>
        </div>
    );
}