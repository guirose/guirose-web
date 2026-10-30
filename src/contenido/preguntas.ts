export type IconoCategoria = "configuracion" | "compra" | "general";

export type Pregunta = {
  pregunta: string;
  respuesta: string;
};

export type CategoriaPreguntas = {
    id: string;
    titulo: string;
    icono?: IconoCategoria;
    preguntas: Pregunta[];
};

// Para que se agregue una categoria se agrega otro bloque a la lista
export const categoriasPreguntas: CategoriaPreguntas[] = [
  {
    id: "configuracion-larga-cola",
    titulo: "Configuracion y larga cola",
    icono: "configuracion",
    preguntas: [
      {
        pregunta: "¿Qué es una larga cola?",
        respuesta:
          "La larga cola es una extensión del eje del motor que permite instalarlo en embarcaciones con mayor altura de espejo. Se utiliza principalmente en embarcaciones de trabajo, transporte o en condiciones de navegación especiales.",
      },
      {
        pregunta: "¿Cómo se configura una larga cola?",
        respuesta:
          "La configuración depende del modelo del motor y de la altura del espejo de la embarcación. Es importante elegir la longitud adecuada y realizar la instalación según las especificaciones de Mercury para garantizar su correcto funcionamiento.",
      },
      {
        pregunta: "¿La garantía en motores con larga cola?",
        respuesta:
          "Sí, siempre que se cumplan las condiciones de garantía de Mercury. La cobertura aplica a los componentes establecidos por el fabricante, como la cabeza de fuerza y la transmisión.",
      },
    ],
  },
  {
    id: "compra-cotizacion",
    titulo: "Compra y Cotización",
    icono: "compra",
    // Provisional
    preguntas: [
      {
        pregunta: "ejemplo",
        respuesta: "ejemplo",
      },
      {
        pregunta: "ejemplo",
        respuesta: "ejemplo",
      },
    ],
  },
];

// Nota de cantidad de preguntas por categoria
export function describirCantidad(cantidad: number): string {
  return `${cantidad} ${cantidad === 1 ? "pregunta" : "preguntas"}`;
}