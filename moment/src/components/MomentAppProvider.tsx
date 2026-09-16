"use client";

import type { ReactNode } from "react";
import { MomentProvider } from "@/context/MomentProvider";

export function MomentAppProvider({ children }: { children: ReactNode }) {
  return <MomentProvider>{children}</MomentProvider>;
}
