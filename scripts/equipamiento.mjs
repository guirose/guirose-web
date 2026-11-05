import ExcelJS from "exceljs";
import { writeFile } from "node:fs/promises";

const ENTRADA = "datos/equipamiento.xlsx";
const SALIDA = "src/contenido/equipamiento.json";
const HOJAS_IGNORADAS = ["Hoja1"];

// Convierte cualquier valor de celda en texto limpio
function texto(valor) {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "object" && "richText" in valor) {
    return valor.richText.map((parte) => parte.text).join("").replace(/\s+/g, " ").trim();
  }
  if (typeof valor === "object" && "result" in valor) return texto(valor.result);
  return String(valor).replace(/\s+/g, " ").trim();
}

const normal = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

// Seccion del Excel -> categoría del ítem
function categoriaDe(seccion, requerimiento) {
  if (requerimiento == "OPCIONAL") return "opcional";
  if (seccion.startsWith("INCLUIDO")) return "incluido";
  if (seccion.includes("MEDIDAS VARIABLES")) return "medida";
  return "obligatorio";
}

// Ítems de medida variable: a qué grupo pertenecen
function grupoDe(descripcion) {
  if (descripcion.startsWith("HELICE")) return "helice";
  if (descripcion.startsWith("CABLE DE ACELERACION")) return "cable";
  if (descripcion.startsWith("INTERRUPTORES DE ENCENDIDO")) return "llave";
  if (/^EXTENSI[OÓ]N DE ARNES/.test(descripcion)) return "extension";
  return "otro";
}

// "X" = la cantidad la elige el cliente
function cantidadDe(valor) {
  const t = texto(valor);
  if (t === "") return null;
  if (t.toUpperCase() === "X") return "elige";
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

const libro = new ExcelJS.Workbook();
await libro.xlsx.readFile(ENTRADA);

const modelos = {};
const avisos = [];

libro.eachSheet((hoja) => {
  if (HOJAS_IGNORADAS.includes(hoja.name)) return;

  console.log(`Leyendo hoja "${hoja.name}" (${hoja.rowCount} filas)`);

  const tipoMotor = hoja.name.startsWith("2T") ? "2-tiempos" : "4-tiempos";
  let columnas = [];
  let seccion = "";

  hoja.eachRow((fila) => {
    const a = texto(fila.getCell(1).value);
    const b = texto(fila.getCell(2).value);
    const c = texto(fila.getCell(3).value).toUpperCase();

    // nombres de los modelos
    if(normal(a) === "CODIGO") {
      columnas = [];
      for (let col = 4; col <= fila.cellCount; col++) {
        const modelo = texto(fila.getCell(col).value);
        if (modelo) columnas.push({ col, modelo });
      }
      return;
    }

    // secciones
    if(normal(a).startsWith("INCLUIDO") || normal(a).startsWith("ACCESORIOS")) {
      seccion = a;
      return;
    }

    if (!b || columnas.length == 0) return;

    const categoria = categoriaDe(seccion, c);
    for (const { col, modelo } of columnas) {
      const cantidad = cantidadDe(fila.getCell(col).value);
      if (cantidad == null) continue;

      const item = { codigo: a || null, descripcion: b, categoria, cantidad };
      if (categoria === "medida") {
        item.grupo = grupoDe(b);
        if (item.grupo === "otro") avisos.push(`${hoja.name} : grupo desconocido para "${b}"`);
      }

      const clave = `${tipoMotor}/${modelo}`;
      modelos[clave] ??= { tipo: tipoMotor, modelo, hoja: hoja.name, items: [] };
      modelos[clave].items.push(item);
    }
  });
});

await writeFile(SALIDA, JSON.stringify(Object.values(modelos), null, 2) + "\n", "utf8");

// resumen terminal
for (const m of Object.values(modelos)) {
  const cuenta = (t) => m.items.filter((i) => i.categoria === t).length;
  console.log(
    `${m.tipo} ${m.modelo.padEnd(10)} incluido ${cuenta("incluido")}, obligatorio ${cuenta("obligatorio")}, medida ${cuenta("medida")}, opcional ${cuenta("opcional")}`,
  );
}
avisos.forEach((a) => console.warn("Aviso:", a));
console.log(`\nListo: ${Object.keys(modelos).length} modelos en ${SALIDA}`);