export default function cargadorImagenes({
    src,
    width,
}: {
    src: string;
    width: number;
}) {
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    return `${base}${src}?w=${width}`;
}