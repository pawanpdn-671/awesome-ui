"use client";

import { cn } from "@/lib/utils";

function BadgePreview({ variant, children, className }: { variant?: string; children?: React.ReactNode; className?: string }) {
  const colors: Record<string, string> = {
    default: "bg-surface-700 text-surface-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        colors[variant || "default"],
        className,
      )}>
      {children || "Badge"}
    </span>
  );
}

function ButtonPreview({
  variant,
  size,
  fullWidth,
  disabled,
  children,
  className,
}: { variant?: string; size?: string; fullWidth?: boolean; disabled?: boolean; children?: React.ReactNode; className?: string }) {
  const variants: Record<string, string> = {
    primary: "bg-awesome-500 text-white",
    secondary: "bg-surface-700 text-surface-200",
    outline: "border border-surface-600 text-surface-300",
    ghost: "text-surface-400",
    destructive: "bg-red-600 text-white",
  };
  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all",
        variants[variant || "primary"] || variants.primary,
        sizes[size || "md"] || sizes.md,
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}>
      {children || "Button"}
    </button>
  );
}

function CardPreview({ variant, children, className }: { variant?: string; children?: React.ReactNode; className?: string }) {
  const variants: Record<string, string> = {
    default: "rounded-xl border border-border",
    outlined: "rounded-xl border-2 border-surface-700",
    elevated: "rounded-xl border border-border shadow-lg shadow-black/20",
    ghost: "rounded-xl border-transparent",
  };
  return (
    <div className={cn(variants[variant || "default"], "overflow-hidden", className)}>
      {children || (
        <div className="p-4 space-y-2">
          <div className="h-3 w-24 bg-surface-700 rounded" />
          <div className="h-2 w-full bg-surface-700 rounded" />
          <div className="h-2 w-3/4 bg-surface-700 rounded" />
        </div>
      )}
    </div>
  );
}

function CardHeaderPreview({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-3 border-b border-surface-700", className)}>
      {children || <div className="text-surface-100 font-semibold text-sm">Card Header</div>}
    </div>
  );
}

function CardBodyPreview({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-3 space-y-3", className)}>
      {children || "Card body content"}
    </div>
  );
}

function CardFooterPreview({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-4 py-3 border-t border-surface-700", className)}>
      {children || <span className="text-surface-400 text-xs">Card Footer</span>}
    </div>
  );
}

function AlertPreview({
  variant,
  title,
  children,
  className,
}: { variant?: string; title?: string; children?: React.ReactNode; className?: string }) {
  const colors: Record<string, string> = {
    info: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    error: "bg-red-500/10 border-red-500/30 text-red-300",
  };
  return (
    <div className={cn("rounded-lg border px-4 py-3 text-sm", colors[variant || "info"], className)}>
      {title && <p className="font-medium mb-1">{title}</p>}
      {children || "Alert message"}
    </div>
  );
}

function InputPreview({ label, placeholder, error, className }: { label?: string; placeholder?: string; error?: boolean; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-xs font-medium text-surface-300">{label}</label>}
      <div
        className={cn(
          "w-full px-3 py-2 rounded-lg border text-sm bg-surface-900 text-surface-400",
          error ? "border-red-500" : "border-surface-700",
        )}>
        {placeholder || "Input field"}
      </div>
      {error && <p className="text-xs text-red-400">Error message</p>}
    </div>
  );
}

function SelectPreview({ label, placeholder, className }: { label?: string; placeholder?: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-xs font-medium text-surface-300">{label}</label>}
      <div className="w-full px-3 py-2 rounded-lg border border-surface-700 text-sm bg-surface-900 text-surface-500">
        {placeholder || "Select an option"} ▾
      </div>
    </div>
  );
}

function TextareaPreview({ label, placeholder, className }: { label?: string; placeholder?: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="text-xs font-medium text-surface-300">{label}</label>}
      <div className="w-full px-3 py-2 rounded-lg border border-surface-700 text-sm bg-surface-900 text-surface-400 min-h-[60px]">
        {placeholder || "Textarea content"}
      </div>
    </div>
  );
}

function CheckboxPreview({ label }: { label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="w-4 h-4 rounded border border-surface-600 bg-surface-900" />
      <span className="text-sm text-surface-300">{label || "Checkbox"}</span>
    </label>
  );
}

function SwitchPreview({ label }: { label?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="w-8 h-4 rounded-full bg-surface-700 relative">
        <div className="w-3 h-3 rounded-full bg-surface-500 absolute left-0.5 top-0.5" />
      </div>
      <span className="text-sm text-surface-300">{label || "Switch"}</span>
    </label>
  );
}

function AvatarPreview({ fallback, size, className }: { src?: string; alt?: string; fallback?: string; size?: string; className?: string }) {
  const sizes: Record<string, string> = { sm: "w-6 h-6 text-[10px]", md: "w-8 h-8 text-xs", lg: "w-12 h-12 text-sm" };
  return (
    <div
      className={cn(
        "rounded-full bg-surface-700 flex items-center justify-center text-surface-400 font-medium",
        sizes[size || "md"],
        className,
      )}>
      {fallback || "A"}
    </div>
  );
}

function ProgressPreview({ value }: { value?: number }) {
  return (
    <div className="w-full h-2 rounded-full bg-surface-700 overflow-hidden">
      <div className="h-full rounded-full bg-awesome-500 transition-all" style={{ width: `${value || 45}%` }} />
    </div>
  );
}

function SkeletonPreview({ variant }: { variant?: string }) {
  const v: Record<string, string> = {
    text: "h-3 w-full",
    circular: "h-8 w-8 rounded-full",
    rectangular: "h-20 w-full rounded-lg",
    card: "h-32 w-full rounded-xl",
    table: "h-40 w-full rounded-lg",
  };
  return <div className={cn("bg-surface-700 animate-pulse", v[variant || "text"])} />;
}

function LoadingPreview({ size, label }: { variant?: string; size?: string; label?: string }) {
  const sizes: Record<string, string> = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return (
    <div className="flex items-center gap-2 text-surface-400">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-surface-600 border-t-awesome-500",
          sizes[size || "md"],
        )}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

function BreadcrumbPreview({ items }: { items?: { label: string }[] }) {
  const crumbs = items || [{ label: "Home" }, { label: "Section" }, { label: "Current" }];
  return (
    <div className="flex items-center gap-1.5 text-xs text-surface-400">
      {crumbs.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span className={i === crumbs.length - 1 ? "text-surface-200" : ""}>{item.label}</span>
          {i < crumbs.length - 1 && <span className="text-surface-600">/</span>}
        </span>
      ))}
    </div>
  );
}

function TablePreview({
  columns,
  rows,
}: { columns?: { key: string; label: string }[]; rows?: Record<string, string>[] }) {
  const cols = columns || [
    { key: "a", label: "Column 1" },
    { key: "b", label: "Column 2" },
  ];
  const data = rows || [{ a: "Data 1", b: "Data 2" }];
  return (
    <div className="rounded-lg border border-surface-700 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface-800">
            {cols.map((col) => (
              <th key={col.key} className="px-3 py-2 text-left text-xs font-medium text-surface-400">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-surface-800">
              {cols.map((col) => (
                <td key={col.key} className="px-3 py-2 text-surface-300">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabsPreview({ children }: { children?: React.ReactNode }) {
  return (
    <div>
      <div className="flex gap-1 border-b border-surface-700 mb-3">
        {["Tab 1", "Tab 2", "Tab 3"].map((tab) => (
          <button
            key={tab}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-t-lg",
              tab === "Tab 1"
                ? "text-awesome-400 border-b-2 border-awesome-500"
                : "text-surface-400",
            )}>
            {tab}
          </button>
        ))}
      </div>
      {children || <div className="text-sm text-surface-400 p-2">Tab content</div>}
    </div>
  );
}

function AccordionPreview({ children }: { children?: React.ReactNode }) {
  return (
    <div className="divide-y divide-surface-700 border border-surface-700 rounded-lg">
      {["Item 1", "Item 2", "Item 3"].map((item) => (
        <div key={item} className="px-3 py-2 text-sm text-surface-300 flex justify-between">
          {item}
          <span className="text-surface-500">▾</span>
        </div>
      ))}
      {children}
    </div>
  );
}

function PaginationPreview({ currentPage }: { currentPage?: number }) {
  const page = currentPage || 1;
  return (
    <div className="flex items-center gap-1">
      <span className="px-2 py-1 text-xs text-surface-400">‹</span>
      {[1, 2, 3].map((p) => (
        <span
          key={p}
          className={cn(
            "px-2 py-1 text-xs rounded",
            p === page ? "bg-awesome-500 text-white" : "text-surface-400",
          )}>
          {p}
        </span>
      ))}
      <span className="px-2 py-1 text-xs text-surface-400">›</span>
    </div>
  );
}

function TooltipPreview({ children }: { content?: string; children?: React.ReactNode }) {
  return (
    <div className="relative inline-flex">
      <span className="text-sm text-surface-400 border-b border-dashed border-surface-600 cursor-help">
        {children || "Hover me"}
      </span>
    </div>
  );
}

function DialogPreview({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-surface-700 bg-surface-900 p-4 max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium">{title || "Dialog Title"}</span>
        <span className="text-surface-500 text-xs">✕</span>
      </div>
      <div className="text-sm text-surface-400">{children || "Dialog content goes here"}</div>
    </div>
  );
}

function DropdownMenuPreview({ label }: { label?: string }) {
  return (
    <div className="relative inline-flex">
      <button className="px-3 py-1.5 text-sm rounded-lg border border-surface-700 text-surface-300 flex items-center gap-2">
        {label || "Menu"} ▾
      </button>
    </div>
  );
}

function SidebarPreview({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-48 rounded-lg border border-surface-700 bg-surface-900 p-2 space-y-0.5">
      {["Dashboard", "Analytics", "Settings", "Help"].map((item) => (
        <div
          key={item}
          className="px-2 py-1.5 text-xs text-surface-300 rounded hover:bg-surface-800 cursor-pointer">
          {item}
        </div>
      ))}
      {children}
    </div>
  );
}

function MenubarPreview() {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-surface-700 bg-surface-900">
      {["File", "Edit", "View", "Help"].map((item) => (
        <span
          key={item}
          className="px-2 py-1 text-xs text-surface-300 rounded hover:bg-surface-800 cursor-pointer">
          {item}
        </span>
      ))}
    </div>
  );
}

function ToastPreview({ variant, title }: { variant?: string; title?: string }) {
  const colors: Record<string, string> = {
    default: "border-surface-700",
    success: "border-emerald-500/30 bg-emerald-500/5",
    error: "border-red-500/30 bg-red-500/5",
    warning: "border-amber-500/30 bg-amber-500/5",
    info: "border-blue-500/30 bg-blue-500/5",
  };
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 text-sm flex items-center justify-between max-w-xs",
        colors[variant || "default"],
      )}>
      <span>{title || "Notification message"}</span>
      <span className="text-surface-500 text-xs ml-2">✕</span>
    </div>
  );
}

function FormPreview({ children }: { children?: React.ReactNode }) {
  return (
    <div className="space-y-3 p-4 rounded-lg border border-surface-700 bg-surface-900/50">
      {children || (
        <>
          <InputPreview label="Email" />
          <ButtonPreview variant="primary">Submit</ButtonPreview>
        </>
      )}
    </div>
  );
}

function TextPreview({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <span className={cn("text-surface-200", className)}>{children}</span>;
}

function HeadingPreview({
  size,
  children,
  className,
}: { size?: string; children?: React.ReactNode; className?: string }) {
  const sizes: Record<string, string> = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg font-semibold",
    lg: "text-xl font-bold",
    xl: "text-2xl font-bold",
    "2xl": "text-3xl font-bold",
  };
  return (
    <div className={cn("text-surface-100 font-semibold", sizes[size || "md"], className)}>
      {children}
    </div>
  );
}

export const previewComponents: Record<string, React.ComponentType<any>> = {
  section: ({ children, className, ...props }) => (
    <section className={cn("py-8", className)} {...props}>
      {children}
    </section>
  ),
  div: ({ children, className, ...props }) => (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  ),
  header: ({ children, className, ...props }) => (
    <header className={cn(className)} {...props}>
      {children}
    </header>
  ),
  nav: ({ children, className, ...props }) => (
    <nav className={cn(className)} {...props}>
      {children}
    </nav>
  ),
  main: ({ children, className, ...props }) => (
    <main className={cn(className)} {...props}>
      {children}
    </main>
  ),
  footer: ({ children, className, ...props }) => (
    <footer className={cn(className)} {...props}>
      {children}
    </footer>
  ),
  article: ({ children, className, ...props }) => (
    <article className={cn(className)} {...props}>
      {children}
    </article>
  ),
  aside: ({ children, className, ...props }) => (
    <aside className={cn(className)} {...props}>
      {children}
    </aside>
  ),
  h1: ({ children, className, ...props }) => (
    <h1 className={cn("text-2xl font-bold text-surface-100", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }) => (
    <h2 className={cn("text-xl font-bold text-surface-100", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }) => (
    <h3 className={cn("text-lg font-semibold text-surface-200", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }) => (
    <h4 className={cn("text-base font-medium text-surface-200", className)} {...props}>
      {children}
    </h4>
  ),
  p: ({ children, className, ...props }) => (
    <p className={cn("text-sm text-surface-300", className)} {...props}>
      {children}
    </p>
  ),
  span: ({ children, className, ...props }) => (
    <span className={cn(className)} {...props}>
      {children}
    </span>
  ),
  ul: ({ children, className, ...props }) => (
    <ul className={cn("space-y-1 list-disc list-inside text-surface-300 text-sm", className)} {...props}>
      {children}
    </ul>
  ),
  li: ({ children, className, ...props }) => (
    <li className={cn("text-surface-300 text-sm", className)} {...props}>
      {children}
    </li>
  ),
  img: () => (
    <div className="w-full h-32 bg-surface-700 rounded-lg flex items-center justify-center text-surface-500 text-xs">
      Image
    </div>
  ),
  a: ({ children, className, ...props }) => (
    <a className={cn("text-awesome-400 hover:underline cursor-pointer", className)} {...props}>
      {children}
    </a>
  ),

  Button: ({ children, ...props }) => <ButtonPreview {...props}>{children}</ButtonPreview>,
  Card: ({ children, ...props }) => <CardPreview {...props}>{children}</CardPreview>,
  "Card.Header": ({ children, ...props }) => <CardHeaderPreview {...props}>{children}</CardHeaderPreview>,
  "Card.Body": ({ children, ...props }) => <CardBodyPreview {...props}>{children}</CardBodyPreview>,
  "Card.Footer": ({ children, ...props }) => <CardFooterPreview {...props}>{children}</CardFooterPreview>,
  Badge: ({ children, ...props }) => <BadgePreview {...props}>{children}</BadgePreview>,
  Alert: ({ children, ...props }) => <AlertPreview {...props}>{children}</AlertPreview>,
  Input: (props) => <InputPreview {...props} />,
  Select: (props) => <SelectPreview {...props} />,
  Textarea: (props) => <TextareaPreview {...props} />,
  Checkbox: (props) => <CheckboxPreview {...props} />,
  Switch: (props) => <SwitchPreview {...props} />,
  Text: ({ children, ...props }) => <TextPreview {...props}>{children}</TextPreview>,
  Heading: ({ children, ...props }) => <HeadingPreview {...props}>{children}</HeadingPreview>,
  Avatar: (props) => <AvatarPreview {...props} />,
  Progress: (props) => <ProgressPreview {...props} />,
  Skeleton: (props) => <SkeletonPreview {...props} />,
  Loading: (props) => <LoadingPreview {...props} />,
  Breadcrumb: (props) => <BreadcrumbPreview {...props} />,
  Table: (props) => <TablePreview {...props} />,
  Tabs: ({ children, ...props }) => <TabsPreview {...props}>{children}</TabsPreview>,
  Accordion: ({ children, ...props }) => <AccordionPreview {...props}>{children}</AccordionPreview>,
  Pagination: (props) => <PaginationPreview {...props} />,
  Tooltip: ({ children, ...props }) => <TooltipPreview {...props}>{children}</TooltipPreview>,
  Dialog: ({ children, ...props }) => <DialogPreview {...props}>{children}</DialogPreview>,
  DropdownMenu: ({ children, ...props }) => <DropdownMenuPreview {...props}>{children}</DropdownMenuPreview>,
  Sidebar: ({ children, ...props }) => <SidebarPreview {...props}>{children}</SidebarPreview>,
  Menubar: (props) => <MenubarPreview {...props} />,
  Toast: ({ children, ...props }) => <ToastPreview {...props}>{children}</ToastPreview>,
  Form: ({ children, ..._props }) => <FormPreview {..._props}>{children}</FormPreview>,

  Tab: ({ children }) => <div className="text-surface-200 text-sm">{children}</div>,
  "Tabs.Tab": ({ children }) => <div className="text-surface-200 text-sm">{children}</div>,
  "Accordion.Item": ({ children }) => (
    <div className="px-3 py-2 border-b border-surface-700 text-sm">{children}</div>
  ),
  "DropdownMenu.Trigger": ({ children }) => <div className="inline-block">{children}</div>,
  "DropdownMenu.Content": ({ children }) => (
    <div className="p-2 bg-surface-800 rounded-lg border border-surface-700">{children}</div>
  ),
  "DropdownMenu.Item": ({ children }) => (
    <div className="px-3 py-1.5 text-sm text-surface-200 hover:bg-surface-700 rounded cursor-pointer">
      {children}
    </div>
  ),
  "Dialog.Content": ({ children }) => (
    <div className="p-6 bg-surface-800 rounded-xl border border-surface-700">{children}</div>
  ),
  "Dialog.Header": ({ children }) => <div className="mb-4">{children}</div>,
  "Dialog.Footer": ({ children }) => <div className="mt-6 flex justify-end gap-2">{children}</div>,
  "Card.Actions": ({ children }) => <div className="px-4 py-3 flex gap-2">{children}</div>,
};
