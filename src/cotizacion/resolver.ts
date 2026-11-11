import {
  describirItem,
  descripcionDetallada,
  detalleBateria,
  etiquetaOpcion,
  metrosOpcion,
  tamanoOpcion,
} from "@/contenido/accesorios";
import {
  equipamientoDe,
  type GrupoDeMedidas,
  type ItemEquipamiento,
} from "@/contenido/equipamiento";
import {
  motoresDe,
  type Altura,
  type Motor,
  type TipoMotor,
  type Variante,
} from "@/contenido/motores";
import { claveDe, CONSULTAR, type Seleccion } from "./seleccion";

// tarjeta del resumen
export type LineaResumen = {
  clave: string;
  etiqueta: "Medida" | "Extensión" | "Opcional";
  nombre: string;
  detalle?: string;
  foto?: string;
  cantidad?: number;
  porConsultar?: boolean;
};

export type Incluido = { clave: string; nombre: string; foto?: string };

export type ResumenCotizacion = {
  motor: Motor;
  variante: Variante;
  nombreMotor: string;
  caracteristicas: string[];
  medidas: LineaResumen[];
  medidasElegidas: number;
  extensiones: LineaResumen[];
  totalExtensiones: number;
  extConsultar: boolean;
  opcionales: LineaResumen[];
  tarjetasIncluidos: Incluido[];
  listaIncluidos: string[];
  totalIncluidos: number;
};

const POR_CONSULTAR = "Un asesor te ayudará a elegir.";

const ALTURAS: Record<Altura, string> = {
  15: "Cola corta 15″",
  20: "Cola larga 20″",
  25: "Cola extra larga 25″",
};

function buscarVariante(tipo: TipoMotor, modelo: string) {
  for (const motor of motoresDe(tipo)) {
    const variante = motor.variantes.find((v) => v.codigo === modelo);
    if (variante) return { motor, variante };
  }
  return undefined;
}

const unir = (partes: (string | undefined)[], separador: string) =>
  partes.filter(Boolean).join(separador);

function lineaDeMedida(g: GrupoDeMedidas, valor: string | undefined): LineaResumen {
  const item = g.opciones.find((o) => claveDe(o) === valor);
  if (valor === CONSULTAR || !item) {
    return {
      clave: `consultar-${g.grupo}`,
      etiqueta: "Medida",
      nombre: g.titulo,
      detalle: POR_CONSULTAR,
      foto: describirItem(g.opciones[0]).foto,
      porConsultar: true,
    };
  }
  const datos = describirItem(item);
  return {
    clave: claveDe(item),
    etiqueta: "Medida",
    nombre: datos.nombre,
    detalle: unir([etiquetaOpcion(item), metrosOpcion(item)], " - "),
    foto: datos.foto,
    cantidad: typeof item.cantidad === "number" && item.cantidad > 1 ? item.cantidad : undefined,
  };
}

function lineaDeExtension(item: ItemEquipamiento, cantidad: number): LineaResumen {
  const datos = describirItem(item);
  return {
    clave: claveDe(item),
    etiqueta: "Extensión",
    nombre: datos.nombre,
    detalle: unir([etiquetaOpcion(item), metrosOpcion(item)], " - "),
    foto: datos.foto,
    cantidad,
  };
}

function lineaDeOpcional(item: ItemEquipamiento): LineaResumen {
  const datos = describirItem(item);
  const partes = detalleBateria(item)?.split(" - ");
  return {
    clave: claveDe(item),
    etiqueta: "Opcional",
    nombre: unir([datos.nombre, partes?.[0]], " "),
    detalle: partes && partes.length > 1 ? partes.slice(1).join(" - ") : undefined,
    foto: datos.foto,
    cantidad: 1,
  };
}

// el unico lugar que lee datos del catalogo, cambiar esto cuando vengan de Supabase(u otro proveedor)
export function resolverCotizacion(sel: Seleccion): ResumenCotizacion | null {
  const encontrado = buscarVariante(sel.tipo, sel.modelo);
  const equipo = equipamientoDe(sel.tipo, sel.modelo);
  if (!encontrado || !equipo) return null;
  const { motor, variante } = encontrado;

  const gruposMedida = equipo.ofrece.medidas.filter((g) => g.grupo !== "extension");
  const grupoExtension = equipo.ofrece.medidas.find((g) => g.grupo === "extension");
  
  const medidas = gruposMedida.map((g) => lineaDeMedida(g, sel.medidas[g.grupo]));

  const extConsultar = Boolean(grupoExtension) && sel.extConsultar;
  let extensiones: LineaResumen[] = [];
  if (grupoExtension && extConsultar) {
    extensiones = [
      {
        clave: "consultar-extension",
        etiqueta: "Extensión",
        nombre: grupoExtension.titulo,
        detalle: POR_CONSULTAR,
        foto: describirItem(grupoExtension.opciones[0]).foto,
        porConsultar: true,
      },
    ];
  } else if (grupoExtension) {
    extensiones = [...grupoExtension.opciones]
      .sort((a, b) => tamanoOpcion(a) - tamanoOpcion(b))
      .flatMap((o) => {
        const cantidad = sel.extensiones[claveDe(o)] ?? 0;
        return cantidad > 0 ? [lineaDeExtension(o, cantidad)] : [];
      });
  }
  const totalExtensiones = extConsultar ? 0 : extensiones.reduce((suma, l) => suma + (l.cantidad ?? 0), 0);

  const opcionales = equipo.agregar.filter((o) => sel.agregados.includes(claveDe(o))).map(lineaDeOpcional);

  const incluidos = [...equipo.ofrece.incluido, ...equipo.ofrece.obligatorio];
  const tarjetasIncluidos = incluidos.map((item) => {
    const { nombre, foto } = describirItem(item);
    return { clave: claveDe(item), nombre, foto };
  });

  return {
    motor,
    variante,
    nombreMotor: `Mercury ${motor.linea} ${motor.hp} HP`,
    caracteristicas: [
      variante.control,
      ALTURAS[variante.altura],
      `Elevación ${variante.inclinacion.toLowerCase()}`,
    ],
    medidas,
    medidasElegidas: medidas.filter((m) => !m.porConsultar).length,
    extensiones,
    totalExtensiones,
    extConsultar,
    opcionales,
    tarjetasIncluidos,
    listaIncluidos: incluidos.map(descripcionDetallada),
    totalIncluidos: incluidos.length,
  };
}