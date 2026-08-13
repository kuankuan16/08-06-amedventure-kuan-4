import { type PropsWithChildren } from "react";
import { CIntroLoader } from "./CIntroLoader";
import { CRouteMotion } from "./CRouteMotion";

export default function ProposalCLayout({ children }: PropsWithChildren) {
  return (
    <CRouteMotion>
      <CIntroLoader />
      {children}
    </CRouteMotion>
  );
}
