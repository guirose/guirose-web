import { soloDigitos, type DatosCliente, type TipoDocumento } from "./datosCliente";
import type { LineaResumen, ResumenCotizacion } from "@/cotizacion/resolver";

// una linea por item elegido
function lineaDe(l: LineaResumen): string {
  if (l.porConsultar) return `- ${l.nombre}: por definir con el asesor`;
  const texto = [l.nombre, l.detalle].filter(Boolean).join(" - ");
  const cantidad =
    l.cantidad !== undefined && l.cantidad > 1 ? ` (x${l.cantidad})` : "";
  return `- ${texto}${cantidad}`;
}

// documento
const NOMBRE_DOCUMENTO: Record<TipoDocumento, string> = {
  dni: "DNI",
  ruc: "RUC",
  ce: "Carné de extranjería",
}

// mensaje que se envía al asesor
export function armarMensaje(r: ResumenCotizacion, d: DatosCliente): string {
  const celular = soloDigitos(d.celular).replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
  const correo = d.correo.trim();
  const comentario = d.comentario.trim();

  const partes = [
    "Hola GUIROSE, quiero una cotización.",
    "",
    `*Motor:* ${r.nombreMotor}`,
    `*Modelo:* ${r.variante.codigo}`,
    `*Configuración:* ${r.caracteristicas.join(" - ")}`,
    "",
    "*Lo que elegí:*",
    ...[...r.medidas, ...r.extensiones, ...r.opcionales].map(lineaDe),
    "",
    `*Lo que incluye GUIROSE (${r.totalIncluidos} ítems):*`,
    ...r.listaIncluidos.map((nombre) => `- ${nombre}`),
    "",
    "*Mis datos:*",
    `Nombre: ${d.nombre.trim()}`,
    `Celular: ${celular}`,
    `${NOMBRE_DOCUMENTO[d.tipoDocumento]}: ${d.documento.trim()}`, // ← NUEVO (temporal hasta el Bloque 4)
  ];
  if (correo) partes.push(`Correo: ${correo}`);
  if (comentario) partes.push("", "*Comentario:*", comentario);

  return partes.join("\n");
}

export const enlaceWhatsApp = (numero: string, texto: string) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;