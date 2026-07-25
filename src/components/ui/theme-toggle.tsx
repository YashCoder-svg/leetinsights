"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Sun, Moon, Sunset, Trees, Snowflake, Zap, Flower2, Check, ChevronDown, Compass, Sprout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const THEMES = [
  { id: "light", name: "Light", icon: Sun, desc: "Classic bright mode", dots: ["bg-white", "bg-indigo-500", "bg-zinc-900"] },
  { id: "dark", name: "Dark", icon: Moon, desc: "Sleek low-light mode", dots: ["bg-zinc-950", "bg-indigo-400", "bg-zinc-100"] },
  { id: "sunset", name: "Sunset Glow", icon: Sunset, desc: "Vibrant twilight warmth", dots: ["bg-[#120c1f]", "bg-pink-500", "bg-purple-100"] },
  { id: "forest", name: "Forest Tech", icon: Trees, desc: "Organic dev environment", dots: ["bg-[#081c15]", "bg-emerald-500", "bg-emerald-50"] },
  { id: "arctic", name: "Arctic Frost", icon: Snowflake, desc: "Cool sub-zero design", dots: ["bg-[#0b131f]", "bg-cyan-400", "bg-cyan-50"] },
  { id: "cyberpunk", name: "Cyberpunk", icon: Zap, desc: "Neon retro-future vibe", dots: ["bg-[#0d0414]", "bg-fuchsia-500", "bg-cyan-400"] },
  { id: "rose", name: "Midnight Rose", icon: Flower2, desc: "Elegant burgundy tone", dots: ["bg-[#14080e]", "bg-rose-500", "bg-pink-100"] },
  { id: "ocean", name: "Deep Ocean", icon: Compass, desc: "Vibrant deep blue glow", dots: ["bg-[#020617]", "bg-cyan-500", "bg-cyan-50"] },
  { id: "sage", name: "Calming Sage", icon: Sprout, desc: "Creamy light vanilla sage", dots: ["bg-[#fcfaf2]", "bg-emerald-600", "bg-[#1b3a24]"] },
];

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Close dropdown on click outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 animate-pulse" />;
  }

  // Find active theme object
  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES.find((t) => t.id === resolvedTheme) || THEMES[1];
  const IconComponent = currentTheme.icon;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white/50 px-2.5 text-zinc-700 backdrop-blur-md transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 cursor-pointer shadow-sm hover:shadow"
        aria-label="Select Theme"
      >
        <IconComponent className="h-4 w-4 transition-transform" />
        <span className="hidden sm:inline text-xs font-bold capitalize">{currentTheme.name}</span>
        <ChevronDown className={`h-3 w-3 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl backdrop-blur-md dark:border-zinc-850 dark:bg-zinc-950/95 z-55"
          >
            <div className="px-2.5 py-1 text-[10px] font-black text-zinc-450 uppercase tracking-wider dark:text-zinc-500">
              Appearance Theme
            </div>
            
            <div className="space-y-0.5 max-h-80 overflow-y-auto no-scrollbar">
              {THEMES.map((t) => {
                const SelectedIcon = t.icon;
                const isSelected = theme === t.id;
                
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-zinc-100 text-zinc-900 font-bold dark:bg-zinc-900 dark:text-zinc-50"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1 rounded-md ${
                        isSelected 
                          ? "bg-indigo-500/10 text-indigo-500 dark:bg-indigo-400/15 dark:text-indigo-400" 
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400"
                      }`}>
                        <SelectedIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-800 dark:text-zinc-200">{t.name}</div>
                        <div className="text-[10px] text-zinc-450 dark:text-zinc-500 font-medium leading-none mt-0.5">{t.desc}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Theme Colors Preview Dots */}
                      <div className="flex -space-x-1">
                        {t.dots.map((dotClass, idx) => (
                          <span
                            key={idx}
                            className={`h-2.5 w-2.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 ${dotClass}`}
                          />
                        ))}
                      </div>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
