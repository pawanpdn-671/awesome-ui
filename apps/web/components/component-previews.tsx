"use client";

import { useState, useCallback } from "react";
import { PanelRight, X, ChevronDown } from "lucide-react";

export function DropdownMenuPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-8 px-4 flex justify-center min-h-[280px] items-start pt-12">
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-lg bg-surface-800 text-sm text-surface-200 border border-border flex items-center gap-2 hover:bg-surface-700 transition-colors"
        >
          Menu
          <svg className="w-4 h-4 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border bg-surface-950 shadow-xl p-1 space-y-0.5 z-20">
              <button className="w-full px-3 py-2 rounded-md text-sm text-surface-200 hover:bg-surface-800 cursor-pointer transition-colors flex items-center justify-between">
                Profile <span className="text-[10px] text-surface-500 font-mono">⌘P</span>
              </button>
              <button className="w-full px-3 py-2 rounded-md text-sm text-surface-200 hover:bg-surface-800 cursor-pointer transition-colors flex items-center justify-between">
                Settings <span className="text-[10px] text-surface-500 font-mono">⌘S</span>
              </button>
              <div className="h-px bg-surface-800 my-1" />
              <button className="w-full px-3 py-2 rounded-md text-sm text-red-400 hover:bg-surface-800 cursor-pointer transition-colors">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ToastPreview() {
  const [toasts, setToasts] = useState<{ id: number; variant: string; message: string }[]>([]);
  const [counter, setCounter] = useState(0);

  const addToast = useCallback((variant: string, message: string) => {
    const id = counter;
    setCounter((c) => c + 1);
    setToasts((prev) => [...prev, { id, variant, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, [counter]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap: Record<string, { path: string; color: string }> = {
    success: {
      path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-emerald-500",
    },
    error: {
      path: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-red-500",
    },
    info: {
      path: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "text-blue-500",
    },
    warning: {
      path: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z",
      color: "text-amber-500",
    },
  };

  return (
    <div className="flex flex-col items-center gap-4 py-8 min-h-[200px]">
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => addToast("success", "Changes saved successfully.")}
          className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:brightness-110 transition-all shadow-sm"
        >
          Show Success
        </button>
        <button
          onClick={() => addToast("error", "Failed to save changes.")}
          className="px-4 py-2 rounded-lg bg-red-700 text-white text-sm font-medium hover:brightness-110 transition-all shadow-sm"
        >
          Show Error
        </button>
        <button
          onClick={() => addToast("info", "Here is some info.")}
          className="px-4 py-2 rounded-lg bg-awesome-700 text-white text-sm font-medium hover:brightness-110 transition-all shadow-sm"
        >
          Show Info
        </button>
      </div>

      <div className="fixed top-20 right-4 z-50 space-y-2 w-full max-w-sm">
        {toasts.map((toast) => {
          const ico = (iconMap[toast.variant] ?? iconMap.info)!;
          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-lg animate-slide-down"
            >
              <svg className={`w-5 h-5 ${ico.color} shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ico.path} />
              </svg>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-surface-50">{toast.message}</div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-surface-500 hover:text-surface-50 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SidebarPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="h-12 bg-white dark:bg-surface-900 border-b border-border flex items-center px-4 gap-3">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label="Open sidebar"
        >
          <PanelRight className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo-white.png" alt="AwesomeUI" className="logo-dark h-5 w-auto" />
          <img src="/logo-black.png" alt="AwesomeUI" className="logo-light h-5 w-auto" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700" />
          <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-700 ml-1" />
        </div>
      </div>
      <div className="h-48 bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <span className="text-xs text-surface-400">Main Content Area</span>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-black/50 animate-fade-in" onClick={() => setOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-40 w-64 border-r border-border bg-white dark:bg-surface-950 shadow-2xl animate-slide-in-left flex flex-col">
            <div className="h-12 px-4 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2.5">
                <img src="/logo-white.png" alt="AwesomeUI" className="logo-dark h-5 w-auto" />
                <img src="/logo-black.png" alt="AwesomeUI" className="logo-light h-5 w-auto" />
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 p-2 space-y-0.5">
              <div className="px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-500">Main Menu</span>
              </div>
              {["Dashboard", "Projects", "Settings", "Team"].map((item) => (
                <button
                  key={item}
                  className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-surface-300 dark:bg-surface-600 shrink-0" />
                  {item}
                </button>
              ))}
            </div>
            <div className="h-12 px-4 flex items-center gap-2.5 border-t border-border">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-awesome-400 to-awesome-600 flex items-center justify-center text-white text-[10px] font-medium shrink-0">JD</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-surface-800 dark:text-surface-200 truncate">John Doe</div>
                <div className="text-[10px] text-surface-500 truncate">john@awesomeui.com</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function AccordionPreview() {
  const [openItem, setOpenItem] = useState<string | null>("item-1");
  return (
    <div className="py-8 px-4 max-w-lg mx-auto">
      <div className="space-y-1">
        {[
          { value: "item-1", title: "What is AwesomeUI?", content: "AwesomeUI is a universal component library that works across every major framework." },
          { value: "item-2", title: "How do I install it?", content: "Run npx awesomeui init in your project directory to get started." },
        ].map((item) => (
          <div key={item.value} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenItem(openItem === item.value ? null : item.value)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-surface-200 hover:bg-surface-800/50 transition-colors"
            >
              {item.title}
              <ChevronDown
                className={`w-4 h-4 text-surface-400 transition-transform duration-300 ${
                  openItem === item.value ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className="transition-all duration-300 overflow-hidden"
              style={{ maxHeight: openItem === item.value ? "200px" : "0" }}
            >
              <div className="px-4 pb-3">
                <p className="text-sm text-surface-400">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DialogPreview() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center py-8">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all"
      >
        Open Dialog
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-xl p-6 max-w-sm w-full border border-border/50 animate-scale-in" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-surface-100 mb-2">Confirm Action</h3>
              <p className="text-sm text-surface-400 mb-5">Are you sure you want to proceed?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-surface-800 text-surface-300 text-sm font-medium hover:bg-surface-700 border border-border transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-awesome-500 text-white text-sm font-medium hover:bg-awesome-600 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function TabsPreview() {
  const [activeTab, setActiveTab] = useState("Overview");
  return (
    <div className="py-8 px-4 max-w-md mx-auto">
      <div className="border-b border-border">
        <div className="flex gap-0">
          {["Overview", "Features", "Pricing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-surface-100" : "text-surface-400 hover:text-surface-200"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-awesome-400" />}
            </button>
          ))}
        </div>
      </div>
      <div className="pt-4">
        <p className="text-sm text-surface-400">
          {activeTab === "Overview" && "Overview content goes here. Switch between tabs to see different content."}
          {activeTab === "Features" && "Features content goes here. Explore the powerful features available in AwesomeUI."}
          {activeTab === "Pricing" && "Pricing content goes here. Choose the right plan for your needs."}
        </p>
      </div>
    </div>
  );
}
