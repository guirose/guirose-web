import type { ReactNode } from "react";
import CabeceraAyuda from "@/app/_ayuda/CabeceraAyuda";

export default function LayoutAyuda({ children }: { children: ReactNode }) {
  return (
    <>
      <CabeceraAyuda />
      <div className="overflow-x-clip">{children}</div>
    </>
  );
}