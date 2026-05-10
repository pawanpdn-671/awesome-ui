import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
}

export function TerminalWindow({ children, label = "terminal", className }: TerminalWindowProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface-950 overflow-hidden", className)}>
      <TerminalHeader label={label} />
      {children}
    </div>
  );
}

export function TerminalHeader({ label = "terminal" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-900/50">
      <span className="w-3 h-3 rounded-full bg-red-500/50" />
      <span className="w-3 h-3 rounded-full bg-amber-500/50" />
      <span className="w-3 h-3 rounded-full bg-emerald-500/50" />
      <span className="ml-2 text-xs text-surface-300">{label}</span>
    </div>
  );
}
