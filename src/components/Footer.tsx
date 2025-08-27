import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-2 text-center text-sm text-[var(--color-text-secondary)]">
      <span>
        {t("copyright", { year })} |{" "}
        <a href="/imprint" className="font-semibold text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors">
          {t("imprint")}
        </a>{" "}
        &{" "}
        <a href="/privacy" className="font-semibold text-black dark:text-white hover:text-black/80 dark:hover:text-white/80 transition-colors">
          {t("privacy")}
        </a>
      </span>
    </footer>
  );
};
