import Image from "next/image";
import Hero from "@/ui/Hero";
import Seccion from "@/ui/Seccion";
import TarjetaMotor from "@/ui/TarjetaMotor";
import BannerPromocion from "@/ui/BannerPromocion";
import TarjetaCategoria from "@/ui/TarjetaCategoria";
import BannerServicio from "@/ui/BannerServicio";
import Aparecer from "@/ui/Aparecer";
import TarjetaActividad from "@/ui/TarjetaActividad";
import { ruta } from "@/ruta";

export default function Home() {
  return (
    <main>
      <Hero
        titulo="Encuentra el motor Mercury ideal para tu embarcación"
        descripcion="Motores de 2 y 4 tiempos para pesca artesanal. Elige la potencia que necesitas y solicita tu cotización con GUIROSE."
        textoBoton="Cotizar mi motor"
        hrefBoton={ruta("/motores")}
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
      <Seccion
        id="actividad"
        titulo="El motor ideal según tu actividad"
        subtitulo="Conoce las recomendaciones de motores Mercury para cada tipo de uso."
      >
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
          <Aparecer>
            <TarjetaActividad
              titulo="Turismo"
              descripcion="Confiabilidad y eficiencia para paseos y operaciones turísticas."
              textoBoton="Ver motores"
              hrefBoton={ruta("/motores")}
              imagen={
                <Image
                  src="/imagenes/actividades/turismo.jpg"
                  alt="Lancha turística con dos motores Mercury"
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={100}>
            <TarjetaActividad
              titulo="Transporte fluvial"
              descripcion="Ideales para pasajeros, cargas y transporte en ríos y lagos."
              textoBoton="Ver motores"
              hrefBoton={ruta("/motores")}
              imagen={
                <Image
                  src="/imagenes/actividades/fluvial.jpg"
                  alt="Bote en un río con motor Mercury SeaPro"
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              }
            />
          </Aparecer>
          <Aparecer retraso={200}>
            <TarjetaActividad
              titulo="Recreativo"
              descripcion="Disfruta la navegación, pesca deportiva y actividades en familia."
              textoBoton="Ver motores"
              hrefBoton={ruta("/motores")}
              imagen={
                <Image
                  src="/imagenes/actividades/recreativo.jpg"
                  alt="Pescador deportivo en un bote con motor Mercury de 40 HP"
                  fill
                  sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              }
            />
          </Aparecer>
        </div>
      </Seccion>
      <Seccion id="motores" titulo="Motores Mercury de 2 y 4 tiempos">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <Aparecer>
            <TarjetaMotor
              titulo={"Motores 2\u00A0tiempos"}
              descripcion="Arranque rápido, respuesta ágil y mecánica sencilla para pesca y navegación."
              textoBoton="Ver motores 2T"
              hrefBoton={ruta("/motores/2-tiempos")}
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
              descripcion="Consumo eficiente, funcionamiento suave y rendimiento para jornadas de navegación."
              textoBoton="Ver motores 4T"
              hrefBoton={ruta("/motores/4-tiempos")}
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
        descripcion="Conoce las experiencias con GUIROSE para adquirir motores fuera de borda Mercury."
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
        titulo="Repuestos y accesorios originales Mercury"
        subtitulo="Encuentra accesorios, lubricantes y repuestos para el cuidado y mantenimiento de tu motor fuera de borda Mercury."
      >
        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-3">
          <Aparecer>
            <TarjetaCategoria
              titulo="Accesorios"
              descripcion="Hélices, mandos y accesorios para equipar tu embarcación."
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
              descripcion="Aceites y lubricantes Mercury y Quicksilver para el cuidado de tu motor."
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
              descripcion="Repuestos originales para un rendimiento confiable."
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
        hrefBoton={ruta("/garantia")}
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
