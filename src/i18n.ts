import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Importiere deine Übersetzungen
import en from "./locales/en.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

i18n
  .use(initReactI18next) // Bindet i18next an React
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      fr: { translation: fr },
    },
    lng: "en",           // Startsprache
    fallbackLng: "en",   // Falls Übersetzung fehlt
    interpolation: {
      escapeValue: false, // React escaped schon selbst
    },
  });

export default i18n;
