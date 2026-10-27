import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BarraSuperior from "@/ui/BarraSuperior";
import Encabezado from "@/ui/Encabezado";
import EncabezadoFijo from "@/ui/EncabezadoFijo";
import PieDePagina from "@/ui/PieDePagina";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Provisional (confirmar textos)
export const metadata: Metadata = {
  title: "GRUIROSE | Motores fuera de borda Mercury",
  description:
    "Motores fuera de borda, repuestos, lubricantes y accesorios Mercury. Asesoría para tu embarcación y envíos a todo el Perú.",
};

// Provisional: los enlaces apuntan a "#" hasta definir las páginas
const enlacesMenu = [
  { texto: "Motores", href: "#" },
  { texto: "Repuestos y accesorios", href: "#" },
  { texto: "Servicios", href: "#" },
  { texto: "Contacto", href: "#" },
];

// Provisional: los enlaces apuntan a "#" hasta definir las páginas
const enlacesCatalogo = [
  { texto: "Motores", href: "#" },
  { texto: "Repuestos y accesorios", href: "#" },
  { texto: "Servicios", href: "#"},
];

const enlacesPrivacidad = [
  { texto: "Motores", href: "#" },
  { texto: "Repuestos y accesorios", href: "#"},
  { texto: "Servicios", href: "#"},
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <BarraSuperior />
        <Encabezado enlaces={enlacesMenu} cantidadCotizacion={0} />
        <EncabezadoFijo cantidadCotizacion={0} />
        {children}
        <PieDePagina catalogo={enlacesCatalogo} privacidad={enlacesPrivacidad} /> 
      </body>
    </html>
  );
}
