import { Badge } from "@/components/ui/badge";
import { type ReactNode } from "react";

interface DocHeaderProps {
  heading: string;
  subheading?: ReactNode;
  badge?: string;
}

export function DocHeader({ heading, subheading, badge }: DocHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-surface-100 tracking-tight">
        {heading}
        {badge && (
          <Badge variant="primary" className="ml-3 align-middle text-xs">
            {badge}
          </Badge>
        )}
      </h1>
      {subheading && (
        <p className="mt-2 text-lg text-surface-400 leading-relaxed max-w-2xl">
          {subheading}
        </p>
      )}
    </div>
  );
}
