// Represents a programming language used in a repository
interface LanguageNode {
  name: string;         // Name of the language, e.g. "TypeScript"
  color: string | null; // Optional hex color for the language (used for UI bars)
}

// Edge structure returned by GitHub GraphQL for a language within a repo
export interface LanguageEdge {
  size: number;         // Number of bytes of code written in this language
  node: LanguageNode;   // The actual language information
}

// Props for a RepoCard component
export interface RepoCardProps {
  repo: Repository;     // The repository to display
}

// Props for a language filter component
export interface LanguageFilterProps {
  languages: string[];                              // List of available languages
  selectedLanguage: string | null;                  // Currently selected language, or null for "All"
  onSelectLanguage: (lang: string | null) => void; // Callback when a language is selected
}

// Props for a search input component
export interface SearchInputProps {
  username: string;                  // Current value of the input
  onChange: (value: string) => void; // Callback when the input changes
  onSearch: () => void;              // Callback when search is triggered
}

// Represents the languages section of a repository
interface RepositoryLanguages {
  totalSize: number;          // Total size in bytes of all languages in the repo
  edges: LanguageEdge[];      // Array of edges, each representing one language
}

// Main repository type
export interface Repository {
  name: string;                       // Repository name
  description: string | null;         // Optional description
  url: string;                        // URL to the repository
  isPrivate: boolean;                 // True if the repository is private
  languages: RepositoryLanguages;     // Languages used in the repository
}

// Type returned by the GitHub GraphQL query
export interface GitHubData {
  user?: {                            // Optional, may be undefined if user not found
    repositories: {
      nodes: Repository[];            // Array of repositories
      pageInfo: {                     // Pagination info
        hasNextPage: boolean;         // True if more repositories exist
        endCursor?: string;           // Cursor for fetching the next page
      };
    };
  };
}