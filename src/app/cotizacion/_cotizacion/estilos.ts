export const enlace = "inline-flex min-h-11 touch-manipulation select-none items-center gap-1.5 text-base font-semibold text-guirose-accion transition duration-150 ease-out hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul";

export const botonPrincipal = "flex min-h-14 w-full touch-manipulation select-none items-center justify-center gap-2.5 rounded-xl bg-guirose-accion px-4 py-3 text-base leading-tight font-semibold text-white transition duration-150 ease-out hover:bg-guirose-marino active:scale-[0.97] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-guirose-azul sm:px-6 sm:text-[17px]";

export const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
