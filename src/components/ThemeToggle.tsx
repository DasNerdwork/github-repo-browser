import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved ? saved === "dark" : true; // default dark
  });

  // Effect to apply the theme whenever it changes & save in localStorage
  useEffect(() => {
    const html = document.documentElement;

    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
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