"use client";

import { useState } from "react";
import Image from "next/image";
import { PackageIcon } from "@phosphor-icons/react/ssr";

type Props = { foto?: string; className?: string };

// Foto de los accesorios, si no tiene se muestra un ícono
export default function FotoAccesorio({ 
  foto, 
  className = "h-20 w-20 rounded-xl bg-white", 
}: Props) {
  const [fallo, setFallo] = useState(false);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden ${className}`}
    >
      {foto && !fallo ? (
        <Image
          src={foto}
          alt=""
          width={320}
          height={320}
          onError={() => setFallo(true)}
          className="h-full w-full object-contain p-2"
        />
      ) : (
        <PackageIcon
          aris-hidden="true"
          className="h-10 w-10 text-guirose-accion"
        />
      )}
    </div>
  );
}