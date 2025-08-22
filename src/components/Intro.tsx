import { useTranslation } from "react-i18next";

interface IntroProps {
  hasSearched: boolean;
}

export const Intro = ({ hasSearched }: IntroProps) => {
  const { t } = useTranslation();
  return (
    <div className={`text-center mb-6 transition-opacity duration-300 ease-in-out translate-y-[25vh] ${hasSearched ? "opacity-0 h-0" : "opacity-100"}`}>
      {/* Intro Title */}
      <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[var(--color-text)]">
        {t("introTitle")}
      </h2>
      
      {/* Intro Description */}
      <p
        className="text-[var(--color-text)]/80 text-lg md:text-xl max-w-2xl mx-auto"
        dangerouslySetInnerHTML={{ __html: t("introDescription") }}
      />
    </div>
  );
};
