"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const nowDark = html.classList.contains("dark");
    html.classList.toggle("dark", !nowDark);
    html.classList.toggle("light", nowDark);
    setDark(!nowDark);
    try {
      localStorage.setItem("theme", nowDark ? "light" : "dark");
    } catch {}
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}
