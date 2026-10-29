import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import logoGuirose from "@/recursos/logo_Guirose-azul.png";
import "./globals.css";
import BarraSuperior from "@/ui/BarraSuperior";
import Encabezado from "@/ui/Encabezado";
import type { EnlaceMenu } from "@/ui/MenuPrincipal";
import PieDePagina from "@/ui/PieDePagina";
import { FlyingSaucerIcon } from "@phosphor-icons/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Provisional (confirmar textos)
export const metadata: Metadata = {
  title: "GUIROSE | Motores fuera de borda Mercury",
  description:
    "Motores fuera de borda, repuestos, lubricantes y accesorios Mercury. Asesoría para tu embarcación y envíos a todo el Perú.",
  // Provisional: por el momento es una prueba publica que Google no indexa
  robots: { index: false, follow: false },
};

// Provisional: los enlaces apuntan a "#" hasta definir las páginas
const enlacesMenu: EnlaceMenu[] = [
  {
    texto: "Motores",
    href: "#motores",
    icono: "motores",
    seccion: "motores",
    submenu: [
      {
        texto: "Motores 2 tiempos",
        descripcion: "Sencillos y de fácil mantenimiento",
        href: "#motores",
      },
      {
        texto: "Motores 4 tiempos",
        descripcion: "Silenciosos y de menor consumo",
        href: "#motores",
      },
    ],
    enlaceFinal: { texto: "Ver todos los motores", href: "#motores" },
  },
  {
    texto: "Repuestos y accesorios",
    href: "#repuestos",
    icono: "repuestos",
    seccion: "repuestos",
  },
  { 
    texto: "Servicios", 
    href: "#servicios", 
    icono: "servicios", 
    seccion: "servicios",
  },
  {
    texto: "Contacto",
    href: "#contacto",
    icono: "contacto",
    seccion: "contacto",
  },
];

// Provisional: busquedas mas frecuentes
const sugerenciasBuscador = [
  { texto: "Motores 2 tiempos", href: "#" },
  { texto: "Motores 4 tiempos", href: "#" },
  { texto: "Hélices", href: "#" },
  { texto: "Lubricantes", href: "#" },
  { texto: "Repuestos", href: "#" },
];

// Provisional: los enlaces apuntan a "#" hasta definir las páginas
const enlacesCatalogo = [
  { texto: "Motores", href: "#" },
  { texto: "Repuestos y accesorios", href: "#" },
  { texto: "Servicios", href: "#" },
];

const enlacesPrivacidad = [
  { texto: "Motores", href: "#" },
  { texto: "Repuestos y accesorios", href: "#" },
  { texto: "Servicios", href: "#" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <BarraSuperior />
        <Encabezado
          enlaces={enlacesMenu}
          sugerencias={sugerenciasBuscador}
          cantidadCotizacion={0}
          logo={
            <Image
              src={logoGuirose}
              alt="GUIROSE"
              preload
              className="h-11 w-auto sm:h-12 lg:h-[60px]"
            />
          }
        />
        {children}
        <div id="contacto">
          <PieDePagina
            catalogo={enlacesCatalogo}
            privacidad={enlacesPrivacidad}
          />
        </div>
      </body>
    </html>
  );
}
