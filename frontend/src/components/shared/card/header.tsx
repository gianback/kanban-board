import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
interface Props {
  children: ReactNode;
  className?: string;
}
export function CardHeader({ children, className }: Props) {
  return <div className={twMerge("", className)}>{children}</div>;
}
