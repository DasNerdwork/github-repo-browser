import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const generateFavicon = (color: string) => {
  // SVG-Favicon als Data-URL
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder-search2-icon"><circle cx="11.5" cy="12.5" r="2.5"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M13.3 14.3 15 16"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // default dark
  });

  // Effect to apply the theme whenever it changes & save in localStorage
  useEffect(() => {
    const html = document.documentElement;
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;

    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      link.href = generateFavicon("#0e558c");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      link.href = generateFavicon("#cb9150");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-full hover:bg-[var(--color-card)] transition"
    >
      {/* Icon depending on mode */}
      {dark ? 
        <Sun 
          size={20}
          strokeWidth={2.5}
          className="text-[var(--color-text)]/90"
          aria-label="Light Mode" /> :
        <Moon 
          size={20}
          strokeWidth={2.5}
          className="text-[var(--color-text)]/90"
          aria-label="Dark Mode" />}
    </button>
  );
};

export default ThemeToggle;