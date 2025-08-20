type RepoCardProps = {
  repo: any; // Du kannst später ein TypeScript-Interface dafür machen
};

export default function RepoCard({ repo }: RepoCardProps) {
  const totalSize = repo.languages.totalSize || 1;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow">
      <h2 className="text-xl font-semibold mb-3">{repo.name}</h2>

      <div className="flex h-4 w-full rounded overflow-hidden mb-3 bg-gray-200">
        {repo.languages.edges.map((edge: any) => {
          const percent = (edge.size / totalSize) * 100;
          return (
            <div
              key={edge.node.name}
              className="h-full"
              style={{ width: `${percent}%`, backgroundColor: edge.node.color || "#6b7280" }}
              title={`${edge.node.name}: ${percent.toFixed(1)}%`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {repo.languages.edges.map((edge: any) => {
          const percent = (edge.size / totalSize) * 100;
          return (
            <span
              key={edge.node.name}
              className="text-sm font-medium px-2 py-1 rounded-full text-white"
              style={{ backgroundColor: edge.node.color || "#6b7280" }}
            >
              {edge.node.name} {percent.toFixed(1)}%
            </span>
          );
        })}
      </div>
    </div>
  );
}
