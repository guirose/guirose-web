import type { ReactNode } from "react";

type PropsLogoAlternado = {
  principal: ReactNode;
  secundario: ReactNode;
};

export default function LogoAlternado({
  principal,
  secundario,
}: PropsLogoAlternado) {
  return (
    <div className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
      <div className="logo-principal">{principal}</div>
      <div aria-hidden="true" className="logo-secundario">
        {secundario}
      </div>
    </div>
  );
}