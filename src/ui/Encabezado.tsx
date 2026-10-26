import { IconoDocumento } from "./iconos";

type EnlaceMenu = { texto: string; href: string };

type PropsEncabezado = {
    enlaces: EnlaceMenu[];
    cantidadCotizacion: number;
};

export default function Encabezado({ enlaces, cantidadCotizacion }: PropsEncabezado) {
    return (
        <header className="bg-white">
            <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-x-12 gap-y-4 px-6 py-5 lg:grid-cols-[230px_1fr_auto] lg:px-[70px]">
                {/* Logo: texto provisional hasta tener el archivo */}
                <a href="/" className="text-4xl font-extrabold tracking-tight text-guirose-marino lg:row-span-2 lg:self-center lg:text-center">GUIROSE</a>
            
                {/* Buscador*/}
                <div role="search">
                    <label htmlFor="buscador" className="sr-only">
                        Buscar productos
                    </label>
                    <input id="buscador" type="search" placeholder="Busca un motor, repuestos o accesorios..." className="h-[60px] w-full rounded-md border border-guirose-marino bg-guirose-gris px-6 text-center text-lg italic placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-guirose-azul"/>
                </div>

                {/* Boton Mi cotizacion */}
                <a href="#" className="flex h-[60px] items-center justify-center gap-3 rounded-md border-2 border-guirose-azul bg-white px-6 text-lg font-semibold text-guirose-azul">
                    <IconoDocumento className="h-7 w-7 text-gruirose-marino" />
                    Mi cotización ({cantidadCotizacion})
                </a>

                {/* Menú */}
                <nav aria-label="Principal" className="lg:col-start-2">
                    <ul className="flex flex-wrap gap-x-12 gap-y-2 text-base font-semibold uppercase text-guirose-marino">
                        {enlaces.map((enlace) => (
                            <li key={enlace.texto}>
                                <a href={enlace.href}>{enlace.texto}</a>
                            </li>
                        ))} 
                    </ul>
                </nav>
            </div> 
        </header>
    );
}