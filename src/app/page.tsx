import Image from "next/image";
import Hero from "@/ui/Hero";
import Seccion from "@/ui/Seccion";
import TarjetaMotor from "@/ui/TarjetaMotor";
import BannerPromocion from "@/ui/BannerPromocion";
import TarjetaCategoria from "@/ui/TarjetaCategoria";
import BannerServicio from "@/ui/BannerServicio";
import Aparecer from "@/ui/Aparecer";

export default function Home() {
  return (
    <main>
      <Hero
        etiqueta="Prepárate para la temporada"
        titulo="Tu próximo motor empieza aquí."
        descripcion="Elige sus características y completa tu equipo con asesoría GUIROSE."
        textoBoton="Encontrar mi motor"
        hrefBoton="#"
        textoEnlace="Ver todos los motores"
        hrefEnlace="#"
        fondo={
          <Image
            src="/imagenes/hero.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover object-right"
          />
        }
      />
      <Seccion titulo="Explora Motores Mercury">
        <div className="mx-auto grid max-w-[1149px] grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-[99px]">
          <Aparecer>
            <TarjetaMotor
              titulo="Motores 2 Tiempos"
              descripcion="Rendimiento confiable para el trabajo diario en el mar."
              textoBoton="Ver motores"
              hrefBoton="#"
              imagen={
                <Image
                  src="/imagenes/motor-2-tiempos.png"
                  alt="Motor fuera de borda Mercury de 2 tiempos"
                  fill
                  loading="eager"
                  sizes="200px"
                  className="object-contain object-bottom"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={100}>
            <TarjetaMotor
              titulo="Motores 4 Tiempos"
              descripcion="Eficiencia y versatilidad para tus actividades."
              textoBoton="Ver motores"
              hrefBoton="#"
              imagen={
                <Image
                  src="/imagenes/motor-4-tiempos.png"
                  alt="Motor fuera de borda Mercury de 2 tiempos"
                  fill
                  sizes="200px"
                  className="object-contain object-bottom"
                />
              }
            />
          </Aparecer>
        </div>
      </Seccion>
      <Seccion
        titulo="Completa tu motor en el siguiente paso"
        subtitulo="Encuentra los mejores repuestos y accesorios con nosotros"
      >
        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-3">
          <Aparecer>
            <TarjetaCategoria
              titulo="Accesorios"
              href="#"
              imagen={
                <Image
                  src="/imagenes/categoria-accesorios.png"
                  alt="Hélice de motor fuera de borda"
                  fill
                  sizes="170px"
                  className="object-contain"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={100}>
            <TarjetaCategoria
              titulo="Lubricantes"
              href="#"
              imagen={
                <Image
                  src="/imagenes/categoria-lubricantes.png"
                  alt="Lubricante Mercury"
                  fill
                  sizes="170px"
                  className="object-contain"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={200}>
            <TarjetaCategoria
              titulo="Repuestos"
              href="#"
              imagen={
                <Image
                  src="/imagenes/categoria-repuestos.png"
                  alt="Batería para motor"
                  fill
                  sizes="170px"
                  className="object-contain"
                />
              }
            />
          </Aparecer>
        </div>
      </Seccion>
      <BannerPromocion
        etiqueta="Promociones GUIROSE"
        titulo="Beneficios para tu próximo motor"
        descripcion="Aprovecha las ofertas en motores, repuestos y accesorios Mercury."
        textoBoton="Ver beneficios y condiciones"
        hrefBoton="#"
        fondo={
          <Image
            src="/imagenes/banner-promociones.jpg"
            alt=""
            fill
            sizes="(min-width: 1440px) 1306px, 100vw"
            className="object-cover object-right"
          />
        }
      />
      <BannerServicio
        titulo="Te acompañamos antes y después de elegir"
        lineas={[
          "Asesoria en cada compra",
          "Consulta las condiciones de nuestros servicios",
        ]}
        textoBoton="Clientes Satisfechos"
        hrefBoton="#"
        imagen={
          <Image
            src="/imagenes/banner-servicio.jpg"
            alt="Técnico de Mercury revisando un motor fuera de borda"
            fill
            sizes="(min-width: 1024px) 693px, 100vw"
            className="object-cover object-left"
          />
        }
      />
    </main>
  );
}