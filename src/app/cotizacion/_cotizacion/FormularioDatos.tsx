"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeftIcon,
  CaretDownIcon,
  HeadsetIcon,
  ShieldCheckIcon,
  TruckIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/ssr";
import { WHATSAPP_ASESOR } from "@/contenido/contacto";
import {
  DOCUMENTOS,
  ORDEN,
  datosVacios,
  formatearCelular,
  validar,
  type Campo,
  type DatosCliente,
  type TipoDocumento,
} from "@/cotizacion/datosCliente";
import { guardarEnvio } from "@/cotizacion/envio";
import { armarMensaje, enlaceWhatsApp } from "@/cotizacion/mensaje";
import { resolverCotizacion } from "@/cotizacion/resolver";
import { useCotizacion } from "@/cotizacion/useCotizacion";
import { ruta } from "@/ruta";
import Aparecer from "@/ui/Aparecer";
import IndicadorPasos from "./IndicadorPasos";
import PanelCotizacion, { textoCorto } from "./PanelCotizacion";
import Vacio from "./Vacio";
import { botonPrincipal, enlace } from "./estilos";

// borde rojo si tiene error
const caja = (error?: string) =>
  `h-14 w-full rounded-xl border-[1.5px] bg-white px-4 text-[17px] text-guirose-marino outline-none transition-colors duration-150 placeholder:text-[#6B8299] focus:border-guirose-accion focus:ring-3 focus:ring-guirose-azul/25 ${
    error ? "border-[#C62828]" : "border-[#B9CBDD]"
  }`;

const cajaCompuesta = (error?: string) =>
  `flex h-14 w-full items-stretch overflow-hidden rounded-xl border-[1.5px] bg-white transition-colors duration-150 focus-within:border-guirose-accion focus-within:ring-3 focus-within:ring-guirose-azul/25 ${
    error ? "border-[#C62828]" : "border-[#B9CBDD]"
  }`;

const etiqueta =
  "mb-2 block text-[17px] leading-snug font-semibold text-guirose-marino";
const opcional = "ml-1.5 text-[15px] font-medium text-[#4B5D70]";
const ayuda = "mt-2 text-[15px] leading-snug text-guirose-texto";

function MensajeError({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p
      id={id}
      className="mt-2 text-[15px] leading-snug font-semibold text-[#B3261E]"
    >
      {texto}
    </p>
  );
}

const CONFIANZA = [
  {
    Icono: ShieldCheckIcon,
    titulo: "Cotización sin compromiso",
    texto: "Recibes una propuesta según lo que elegiste.",
  },
  {
    Icono: HeadsetIcon,
    titulo: "Asesoría experta",
    texto: "Un asesor de GUIROSE revisa tu equipo contigo.",
  },
  {
    Icono: TruckIcon,
    titulo: "Envíos a todo el Perú",
    texto: "Llevamos tu motor donde lo necesites.",
  },
];

export default function FormularioDatos() {
  const { seleccion, listo } = useCotizacion();
  const resumen = useMemo(
    () => (seleccion ? resolverCotizacion(seleccion) : null),
    [seleccion],
  );
  const [datos, setDatos] = useState<DatosCliente>(datosVacios);
  const [intento, setIntento] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const campos = useRef<Partial<Record<Campo, HTMLElement | null>>>({});

  if (!listo) return <div aria-hidden="true" className="min-h-[70vh]" />;
  if (!seleccion || !resumen) return <Vacio />;

  // los errores se muestran recién después del primer intento, y se borran al corregir
  const errores = intento ? validar(datos) : {};
  const documento = DOCUMENTOS[datos.tipoDocumento];

  const cambiar = <K extends Campo>(campo: K, valor: DatosCliente[K]) =>
    setDatos((actual) => ({ ...actual, [campo]: valor }));

  const describir = (campo: Campo, conAyuda = false) =>
    [conAyuda ? `ayuda-${campo}` : "", errores[campo] ? `error-${campo}` : ""]
      .filter(Boolean)
      .join(" ") || undefined;

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setIntento(true);
    const encontrados = validar(datos);
    const primero = ORDEN.find((campo) => encontrados[campo]);
    if (primero) {
      campos.current[primero]?.focus();
      return;
    }
    if (!WHATSAPP_ASESOR) {
      setAviso(
        "Falta configurar el número de WhatsApp de GUIROSE (src/contenido/contacto.ts).",
      );
      return;
    }
    const enlaceWa = enlaceWhatsApp(
      WHATSAPP_ASESOR,
      armarMensaje(resumen, datos),
    );
    // se abre dentro del clic para que el navegador no lo bloquee
    const ventana = window.open(enlaceWa, "_blank");
    if (ventana) ventana.opener = null;
    guardarEnvio({
      enlace: enlaceWa,
      motor: `${resumen.nombreMotor} · ${resumen.variante.codigo}`,
      abierto: ventana !== null,
    });
    window.location.assign(ruta("/cotizacion/gracias"));
  };

  return (
    <div className="mx-auto max-w-[1440px] px-6 pt-8 pb-12 lg:px-[67px] lg:pb-16">
      {/* título y pasos */}
      <div className="flex flex-col-reverse gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div>
          <h1 className="text-[32px] leading-tight font-bold tracking-[-0.02em] text-guirose-marino lg:text-[40px]">
            Déjanos tus datos
          </h1>
          <p className="mt-2 text-lg text-guirose-texto">
            Todos los campos son obligatorios, salvo los que dicen «opcional».
          </p>
        </div>
        <div className="lg:mt-1.5">
          <IndicadorPasos actual={2} />
        </div>
      </div>
      <div className="relative mt-4 h-px bg-guirose-espuma-fuerte">
        <span className="absolute top-0 left-0 h-0.5 w-24 -translate-y-px bg-guirose-azul" />
      </div>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-8">
          {/* resumen en celular */}
          <details className="group rounded-2xl border border-guirose-espuma-fuerte bg-guirose-espuma lg:hidden">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 text-base font-semibold text-guirose-marino [&::-webkit-details-marker]:hidden">
              <span>Tu cotización: {textoCorto(resumen)}</span>
              <CaretDownIcon
                aria-hidden="true"
                className="h-5 w-5 shrink-0 transition duration-150 ease-out group-open:rotate-180"
              />
            </summary>
            <PanelCotizacion
              resumen={resumen}
              titulo={false}
              className="border-0 px-4 pt-0 pb-2"
            />
          </details>

          <Aparecer>
            <form
              noValidate
              onSubmit={enviar}
              className="rounded-2xl border-[1.5px] border-guirose-espuma-fuerte bg-white p-5 sm:p-7"
            >
              <h2 className="text-2xl font-bold text-guirose-marino">
                Tus datos
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
                {/* nombre */}
                <div>
                  <label htmlFor="nombre" className={etiqueta}>
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    ref={(el) => {
                      campos.current.nombre = el;
                    }}
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    value={datos.nombre}
                    onChange={(e) => cambiar("nombre", e.target.value)}
                    aria-invalid={Boolean(errores.nombre)}
                    aria-describedby={describir("nombre")}
                    className={caja(errores.nombre)}
                  />
                  <MensajeError id="error-nombre" texto={errores.nombre} />
                </div>

                {/* celular */}
                <div>
                  <label htmlFor="celular" className={etiqueta}>
                    Celular (WhatsApp)
                  </label>
                  <div className={cajaCompuesta(errores.celular)}>
                    <span className="flex items-center border-r-[1.5px] border-[#D9E3EE] px-4 text-[17px] font-semibold text-guirose-marino">
                      +51
                    </span>
                    <input
                      id="celular"
                      ref={(el) => {
                        campos.current.celular = el;
                      }}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      enterKeyHint="next"
                      placeholder="987 654 321"
                      maxLength={11}
                      value={datos.celular}
                      onChange={(e) =>
                        cambiar(
                          "celular",
                          formatearCelular(e.target.value),
                        )
                      }
                      aria-invalid={Boolean(errores.celular)}
                      aria-describedby={describir("celular", true)}
                      className="min-w-0 flex-1 bg-transparent px-4 text-[17px] text-guirose-marino outline-none placeholder:text-[#6B8299]"
                    />
                  </div>
                  <p id="ayuda-celular" className={ayuda}>
                    Te escribiremos a este número.
                  </p>
                  <MensajeError id="error-celular" texto={errores.celular} />
                </div>

                {/* documento */}
                <div>
                  <label htmlFor="documento" className={etiqueta}>
                    Documento
                  </label>
                  <div className={cajaCompuesta(errores.documento)}>
                    <div className="relative flex shrink-0 border-r-[1.5px] border-[#D9E3EE] bg-[#F5FAFF]">
                      <select
                        aria-label="Tipo de documento"
                        value={datos.tipoDocumento}
                        onChange={(e) => {
                          cambiar(
                            "tipoDocumento",
                            e.target.value as TipoDocumento,
                          );
                          cambiar("documento", "");
                        }}
                        className="cursor-pointer appearance-none bg-transparent pr-10 pl-4 text-[17px] font-semibold text-guirose-marino outline-none"
                      >
                        {(Object.keys(DOCUMENTOS) as TipoDocumento[]).map(
                          (tipo) => (
                            <option key={tipo} value={tipo}>
                              {DOCUMENTOS[tipo].nombre}
                            </option>
                          ),
                        )}
                      </select>
                      <CaretDownIcon
                        aria-hidden="true"
                        weight="bold"
                        className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-guirose-marino"
                      />
                    </div>
                    <input
                      id="documento"
                      ref={(el) => {
                        campos.current.documento = el;
                      }}
                      type="text"
                      inputMode={documento.soloNumeros ? "numeric" : "text"}
                      autoComplete="off"
                      autoCapitalize="characters"
                      enterKeyHint="next"
                      placeholder={documento.ejemplo}
                      maxLength={documento.largo}
                      value={datos.documento}
                      onChange={(e) =>
                        cambiar(
                          "documento",
                          documento.soloNumeros
                            ? e.target.value.replace(/\D/g, "")
                            : e.target.value
                                .replace(/[^a-z0-9]/gi, "")
                                .toUpperCase(),
                        )
                      }
                      aria-invalid={Boolean(errores.documento)}
                      aria-describedby={describir("documento", true)}
                      className="min-w-0 flex-1 bg-transparent px-4 text-[17px] text-guirose-marino outline-none placeholder:text-[#6B8299]"
                    />
                  </div>
                  <p id="ayuda-documento" className={ayuda}>
                    {documento.ayuda}
                  </p>
                  <MensajeError
                    id="error-documento"
                    texto={errores.documento}
                  />
                </div>

                {/* correo */}
                <div>
                  <label htmlFor="correo" className={etiqueta}>
                    Correo<span className={opcional}>(opcional)</span>
                  </label>
                  <input
                    id="correo"
                    ref={(el) => {
                      campos.current.correo = el;
                    }}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    enterKeyHint="next"
                    placeholder="tucorreo@ejemplo.com"
                    value={datos.correo}
                    onChange={(e) => cambiar("correo", e.target.value)}
                    aria-invalid={Boolean(errores.correo)}
                    aria-describedby={describir("correo", true)}
                    className={caja(errores.correo)}
                  />
                  <p id="ayuda-correo" className={ayuda}>
                    Si prefieres recibir la propuesta también por correo.
                  </p>
                  <MensajeError id="error-correo" texto={errores.correo} />
                </div>

                {/* comentario */}
                <div className="sm:col-span-2">
                  <label htmlFor="comentario" className={etiqueta}>
                    ¿Algo más que debamos saber?
                    <span className={opcional}>(opcional)</span>
                  </label>
                  <textarea
                    id="comentario"
                    rows={3}
                    maxLength={500}
                    placeholder="Por ejemplo: lo uso para pesca en Paita, tengo una embarcación de 8 metros."
                    value={datos.comentario}
                    onChange={(e) => cambiar("comentario", e.target.value)}
                    className={`${caja()} h-auto min-h-24 resize-y py-3 leading-snug`}
                  />
                </div>

                {/* privacidad: antes del botón */}
                <div className="sm:col-span-2">
                  <label
                    className={`flex cursor-pointer items-start gap-3.5 rounded-xl p-4 text-base leading-snug text-guirose-marino ${
                      errores.acepta
                        ? "bg-[#FDECEC] ring-2 ring-[#C62828]"
                        : "bg-[#F5FAFF]"
                    }`}
                  >
                    <input
                      ref={(el) => {
                        campos.current.acepta = el;
                      }}
                      type="checkbox"
                      checked={datos.acepta}
                      onChange={(e) => cambiar("acepta", e.target.checked)}
                      aria-invalid={Boolean(errores.acepta)}
                      aria-describedby={describir("acepta")}
                      className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-guirose-accion"
                    />
                    <span>
                      Acepto la{" "}
                      <a
                        href="#"
                        className="font-semibold text-guirose-accion underline underline-offset-2"
                      >
                        Política de privacidad
                      </a>{" "}
                      de GUIROSE. Usamos tus datos solo para esta cotización.
                    </span>
                  </label>
                  <MensajeError id="error-acepta" texto={errores.acepta} />
                </div>

                <div className="sm:col-span-2">
                  <button type="submit" className={botonPrincipal}>
                    <WhatsappLogoIcon aria-hidden="true" className="h-6 w-6" />
                    <span className="hidden sm:inline">
                      Enviar cotización por WhatsApp
                    </span>
                    <span className="sm:hidden">Enviar por WhatsApp</span>
                  </button>
                  {aviso && (
                    <p
                      role="alert"
                      className="mt-3 rounded-lg bg-[#FDECEC] px-4 py-3 text-[15px] font-semibold text-[#8A1C1C]"
                    >
                      {aviso}
                    </p>
                  )}
                  <p className="mt-3 text-center text-[15px] text-guirose-texto">
                    Se abrirá WhatsApp con tu cotización lista para enviar.
                  </p>
                </div>
              </div>
            </form>
          </Aparecer>

          {/* franja de confianza */}
          <ul className="grid gap-3 sm:grid-cols-3">
            {CONFIANZA.map(({ Icono, titulo, texto }) => (
              <li
                key={titulo}
                className="flex items-start gap-3.5 rounded-2xl bg-guirose-espuma p-4"
              >
                <Icono
                  aria-hidden="true"
                  className="h-8 w-8 shrink-0 text-guirose-accion"
                />
                <p>
                  <span className="block text-[17px] leading-snug font-bold text-guirose-marino">
                    {titulo}
                  </span>
                  <span className="mt-1 block text-[15px] leading-snug text-guirose-texto">
                    {texto}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* resumen en escritorio */}
        <PanelCotizacion
          resumen={resumen}
          className="hidden lg:sticky lg:top-[140px] lg:block"
        >
          <a
            href={ruta("/cotizacion")}
            className={`${enlace} mt-2 w-full justify-center`}
          >
            <ArrowLeftIcon aria-hidden="true" className="h-[18px] w-[18px]" />
            Volver al resumen
          </a>
        </PanelCotizacion>
      </div>
    </div>
  );
}
