import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { CardHeader } from "./header";
import { CardBody } from "./body";

interface Props {
  className?: string;
  children: ReactNode;
}

export default function Card({ className, children }: Props) {
  return (
    <article className={twMerge("space-y-2 p-4 rounded-md", className)}>
      {children}
    </article>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
