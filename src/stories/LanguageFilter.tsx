type LanguageFilterProps = {
  languages: string[];
  selectedLanguage: string | null;
  onSelectLanguage: (lang: string | null) => void;
};

export default function LanguageFilter({ languages, selectedLanguage, onSelectLanguage }: LanguageFilterProps) {
  return (
    <div className="flex gap-2 mb-6 justify-center flex-wrap">
      <button
        className={`px-3 py-1 rounded-full border ${selectedLanguage === null ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        onClick={() => onSelectLanguage(null)}
      >
        All
      </button>
      {languages.map((lang) => (
        <button
          key={lang}
          className={`px-3 py-1 rounded-full border ${selectedLanguage === lang ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => onSelectLanguage(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
