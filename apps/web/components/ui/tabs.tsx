"use client";

import { createContext, useContext, useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Must be used within Tabs");
  return ctx;
}

interface TabsProps { defaultValue: string; children: ReactNode; className?: string; }
function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps { children: ReactNode; className?: string; }
function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg bg-surface-800/50 p-1 border border-surface-700/50", className)}>
      {children}
    </div>
  );
}

interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> { value: string; }
function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200",
        activeTab === value
          ? "bg-awesome-500/20 text-awesome-300 shadow-sm"
          : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps { value: string; children: ReactNode; className?: string; }
function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabs();
  if (activeTab !== value) return null;
  return <div className={cn("mt-4", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
