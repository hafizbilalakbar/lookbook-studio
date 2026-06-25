import React, { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export type ThemeType = "light" | "dark" | "system";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as ThemeType) || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (t: ThemeType) => {
      root.classList.remove("light", "dark");
      if (t === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(t);
      }
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const themes: { id: ThemeType; label: string; icon: React.ReactNode }[] = [
    { id: "light", label: "Light", icon: <Sun className="w-3.5 h-3.5" /> },
    { id: "dark", label: "Dark", icon: <Moon className="w-3.5 h-3.5" /> },
    { id: "system", label: "System", icon: <Monitor className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center space-x-1 bg-panel border border-line p-1 rounded-full shadow-sm">
      {themes.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={`${t.label} Mode`}
            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all cursor-pointer ${
              isActive
                ? "bg-accent text-bg font-medium"
                : "text-muted hover:text-text-main"
            }`}
          >
            {t.icon}
            <span className="hidden xs:inline text-[9px] uppercase tracking-widest pl-0.5">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
