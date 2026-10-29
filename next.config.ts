import type { NextConfig } from "next";

// Solo en Github Pages: se exporta el HTML estático y se usa la subcarpeta del repo
const paraPages = process.env.GITHUB_PAGES === "true";
const basePath = paraPages ? "/guirose-web" : "";

const nextConfig: NextConfig = {
  output: paraPages ? "export" : undefined,
  basePath,
  images: paraPages
    ? { loader: "custom", loaderFile: "./src/cargador-imagenes.ts" }
    : {},
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
