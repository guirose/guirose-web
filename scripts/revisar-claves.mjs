import { readFileSync } from "node:fs";

const modelos = JSON.parse(
  readFileSync(
    new URL("../src/contenido/equipamiento.json", import.meta.url), "utf8"),
);

let problemas = 0;
for (const m of modelos) {
  const vistas = new Map();
  for (const i of m.items) {
    const clave = i.codigo ?? i.descripcion;
    vistas.set(clave, (vistas.get(clave) ?? 0) + 1);
  }
  for (const [clave, veces] of vistas) {
    if (veces > 1) {
        probelmas++;
      console.log(`${m.tipo} ${m.modelo}: "${clave}" aparece ${veces} veces`);
    }
  }
}
console.log(problemas === 0 ? "Sin claves repetidas" : `${problemas} problema(s)`);