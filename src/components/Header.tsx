import { ThemeToggle, LanguageSelector } from "./index";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  currentLanguage: "de" | "en" | "es" | "fr";
  setCurrentLanguage: (lang: "de" | "en" | "es" | "fr") => void;
}

export const Header = ({ currentLanguage, setCurrentLanguage }: HeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-between items-center mb-8 gap-2">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        <a href="/" className="cursor-pointer">
          {t("projectTitle")}
        </a>
      </h1>

      <div className="flex items-center gap-2">
        <LanguageSelector current={currentLanguage} onChange={setCurrentLanguage} />
        <ThemeToggle />
      </div>
    </div>
  );
};
