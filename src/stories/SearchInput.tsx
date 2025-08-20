type SearchInputProps = {
  username: string;
  onChange: (value: string) => void;
  onSearch: () => void;
};

export default function SearchInput({ username, onChange, onSearch }: SearchInputProps) {
  return (
    <div className="mb-6 flex gap-2 justify-center">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        onClick={onSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Search
      </button>
    </div>
  );
}
