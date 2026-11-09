import Image from "next/image";
import { PackageIcon } from "@phosphor-icons/react/ssr";

type Props = { foto?: string; className?: string };

// Foto de los accesorios, si no tiene se muestra un ícono
export default function FotoAccesorio({ foto, className = "h-20 w-20" }: Props) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-white ${className}`}
    >
      {foto ? (
        <Image
          src={foto}
          alt=""
          width={160}
          height={160}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <PackageIcon aris-hidden="true" className="h-8 w-8 text-guirose-accion" />
      )}
    </div>
  );
}