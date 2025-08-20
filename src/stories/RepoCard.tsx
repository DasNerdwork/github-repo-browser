export default function RepoCard({ repo }: { repo: any }) {
  const totalSize = repo.languages.totalSize || 1;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md bg-[--color-card] transition-colors hover:shadow-xl hover:-translate-y-1 transform">
      {/* Header: Repo Name */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-[--color-text]">
          {repo.name}
        </h2>
        {repo.description && (
          <p className="text-sm text-[--color-text]/80 mt-1">
            {repo.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Language bar */}
        <div className="flex h-3 w-full rounded overflow-hidden mb-4 bg-gray-200 dark:bg-gray-700">
          {repo.languages.edges.map((edge: any) => {
            const percent = (edge.size / totalSize) * 100;
            return (
              <div
                key={edge.node.name}
                className="h-full"
                style={{
                  width: `${percent}%`,
                  backgroundColor: edge.node.color || "#6b7280",
                }}
                title={`${edge.node.name}: ${percent.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Language list (GitHub style) */}
        <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[--color-text]/90">
          {repo.languages.edges.map((edge: any) => {
            const percent = (edge.size / totalSize) * 100;
            return (
              <li
                key={edge.node.name}
                className="flex items-center"
              >
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: edge.node.color || "#6b7280" }}
                />
                <span>{edge.node.name}</span>
                <span className="ml-1 text-[--color-text]/60">
                  {percent.toFixed(1)}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
