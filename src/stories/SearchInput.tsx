export default function SearchInput({ username, onChange, onSearch }: any) {
  return (
    <div className="mb-6 flex gap-2 justify-center">
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 w-64 text-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        onClick={onSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow 
                   transition transform hover:-translate-y-0.5"
      >
        Search
      </button>
    </div>
  );
}
