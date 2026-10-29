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
        titulo="Tu próximo motor empieza aquí"
        descripcion="Elige sus características y completa tu equipo con asesoría GUIROSE"
        textoBoton="Encontrar mi motor"
        hrefBoton="#motores"
        textoEnlace="Ver todos los motores"
        hrefEnlace="#motores"
        fondo={
          <Image
            src="/imagenes/hero.jpg"
            alt="Pescador junto a un motor Mercury en su bote"
            fill
            preload
            sizes="100vw"
            className="object-cover object-right"
          />
        }
      />
      <Seccion id="motores" titulo="Explora Motores Mercury">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <Aparecer>
            <TarjetaMotor
              titulo={"Motores 2\u00A0tiempos"}
              descripcion="Rendimiento confiable de arranque rápido y fácil de transporte."
              textoBoton="Ver motores"
              hrefBoton="#"
              imagen={
                <Image
                  src="/imagenes/motor-2-tiempos.png"
                  alt="Motor fuera de borda Mercury de 2 tiempos"
                  fill
                  loading="eager"
                  sizes="260px"
                  className="object-contain object-bottom"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={100}>
            <TarjetaMotor
              titulo={"Motores 4\u00A0tiempos"}
              descripcion="Potencia y ahorro de combustible, con funcionamiento silencioso y gran durabilidad."
              textoBoton="Ver motores"
              hrefBoton="#"
              imagen={
                <Image
                  src="/imagenes/motor-4-tiempos.png"
                  alt="Motor fuera de borda Mercury de 4 tiempos"
                  fill
                  sizes="260px"
                  className="object-contain object-bottom"
                />
              }
            />
          </Aparecer>
        </div>
      </Seccion>
      <BannerPromocion
        id="clientes"
        titulo="La confianza de nuestros clientes nos respalda"
        descripcion="Conoce las experiencias de nuestros clientes y por qué eligen Mercury"
        textoBoton="Conoce sus experiencias"
        hrefBoton="#"
        fondo={
          <Image
            src="/imagenes/banner-confianza.jpg"
            alt=""
            fill
            sizes="(min-width: 1440px) 1306px, 100vw"
            className="object-cover object-right"
          />
        }
      />
      <Seccion
        id="repuestos"
        titulo="Completa tu motor en el siguiente paso"
        subtitulo="Encuentra los mejores repuestos y accesorios con nosotros"
      >
        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-3">
          <Aparecer>
            <TarjetaCategoria
              titulo="Accesorios"
              descripcion="Hélices, mandos, tanques y más para tu embarcación"
              textoEnlace="Ver accesorios"
              href="#"
              imagen={
                <Image
                  src="/imagenes/categoria-accesorios.png"
                  alt="Hélice de motor fuera de borda"
                  fill
                  sizes="150px"
                  className="object-contain"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={100}>
            <TarjetaCategoria
              titulo="Lubricantes"
              descripcion="Aceite y productos para el cuidado de tu motor"
              textoEnlace="Ver lubricantes"
              href="#"
              imagen={
                <Image
                  src="/imagenes/categoria-lubricantes.png"
                  alt="Lubricante Mercury"
                  fill
                  sizes="150px"
                  className="object-contain"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={200}>
            <TarjetaCategoria
              titulo="Repuestos"
              descripcion="Repuestos originales para un rendimiento confiable"
              textoEnlace="Ver repuestos"
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
      <BannerServicio
        id="servicios"
        titulo="Garantía y servicios para motores Mercury"
        descripcion="Conoce las condiciones de garantía, las opciones de entrega y los servicios que GUIROSE tiene para ti"
        textoBoton="Resuelve tus dudas"
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
