import { useState, useRef, useEffect } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

// Define the supported language codes
type Language = "en" | "de" | "es" | "fr";

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector({ current, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false); // Local state whether dropdown is open
  const ref = useRef<HTMLDivElement>(null); // Ref to the wrapper div to detect outside clicks
  const { t, i18n } = useTranslation();

  const languages: { code: Language; labelKey: string }[] = [
    { code: "en", labelKey: "language.en" },
    { code: "de", labelKey: "language.de" },
    { code: "es", labelKey: "language.es" },
    { code: "fr", labelKey: "language.fr" },
  ];

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    onChange(lang);       // React State
    i18n.changeLanguage(lang); // i18next global
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-full hover:bg-[var(--color-card)]/30 transition flex items-center"
        aria-label={t("selectLanguage")}
      >
        <Languages size={20} className="text-[var(--color-primary-text)]/90" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-[var(--color-card)] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center transition
                ${current === lang.code ? "bg-[var(--color-base)]/20 font-semibold" : "hover:bg-[var(--color-base)]/20"}`}
            >
              {t(lang.labelKey)}
              {current === lang.code && <span className="font-bold">✔</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}