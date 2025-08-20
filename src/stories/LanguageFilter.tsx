export default function LanguageFilter({ languages, selectedLanguage, onSelectLanguage }: any) {
  return (
    <div className="flex gap-2 mb-6 justify-center flex-wrap">
      <button
        className={`px-4 py-2 rounded-full border ${
          selectedLanguage === null
            ? "bg-blue-600 text-white border-blue-500"
            : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
        }`}
        onClick={() => onSelectLanguage(null)}
      >
        All
      </button>
      {languages.map((lang: string) => (
        <button
          key={lang}
          className={`px-4 py-2 rounded-full border ${
            selectedLanguage === lang
              ? "bg-blue-600 text-white border-blue-500"
              : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
          }`}
          onClick={() => onSelectLanguage(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
