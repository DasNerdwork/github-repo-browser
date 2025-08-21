import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  availableLanguages: string[];
  selectedLanguages: string[];
  setSelectedLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  owner: string;
  hasSearched: boolean;
}

export const SearchBar = ({
  username,
  setUsername,
  handleSearch,
  isDropdownOpen,
  setIsDropdownOpen,
  availableLanguages,
  selectedLanguages,
  setSelectedLanguages,
  owner,
  hasSearched,
}: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className={`w-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${hasSearched ? "translate-y-0" : "translate-y-[25vh]"}`}>
      <div className={`w-full flex flex-wrap gap-4 justify-center items-center mb-10`}>
        <div className="flex flex-1 max-w-lg rounded-lg shadow-sm overflow-hidden">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            spellCheck={false}
            className="flex-1 px-4 py-3 bg-[var(--color-card)] text-[var(--color-text)] border border-transparent focus:outline-none transition"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-3 bg-[var(--color-primary)] text-[var(--color-primary-text)] font-medium hover:bg-[var(--color-primary)]/80 transition-shadow shadow-sm hover:shadow-md"
          >
            <Search size={20} strokeWidth={2.5} className="text-[var(--color-primary-text)]/90" />
          </button>
        </div>

        {(owner || availableLanguages.length > 0) && (
          <div className={`relative inline-block text-left transition-all duration-700 ease-in-out ${hasSearched ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="inline-flex justify-center min-w-44 items-center rounded-lg px-4 py-3 bg-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)]/80 transition-shadow shadow-sm hover:shadow-md"
            >
              {t("filterLanguages")}
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 w-56 rounded-lg shadow-md bg-[var(--color-card)] z-10">
                <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar !p-0">
                  {availableLanguages.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        className={`w-full text-left px-4 py-2 text-sm text-[var(--color-text)] flex justify-between items-center transition
                          ${isSelected ? "bg-[var(--color-card)]/80 font-semibold" : "hover:bg-[var(--color-base)] hover:bg-opacity-80"}`}
                        onClick={() => {
                          setSelectedLanguages((prev) =>
                            prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
                          );
                        }}
                      >
                        {lang}
                        {isSelected && <span className="font-bold">✔</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
