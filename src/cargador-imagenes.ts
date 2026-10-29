export default function cargadorImagenes({ src }: { src: string }): string {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

    if (/^https?:\/\//.test(src)) return src;

    if (base === "" || src.startsWith(`${base}/`)) return src;

    return `&{base}${src}`;
}