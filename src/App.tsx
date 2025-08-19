import { gql, useQuery } from "@apollo/client";

export const GET_USER_REPOS = gql`
  query UserRepos($owner: String!) {
    user(login: $owner) {
      repositories(first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          name
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            totalSize
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export default function App() {
  const owner = "DasNerdwork";
  const { data, loading, error } = useQuery(GET_USER_REPOS, {
    variables: { owner },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Repositories of {owner}</h2>
      {data.user.repositories.nodes.map((repo: any) => (
        <div key={repo.name}>
          <h3>{repo.name}</h3>
          <ul>
            {repo.languages.edges.map((edge: any) => (
              <li key={edge.node.name}>
                <span style={{ color: edge.node.color }}>
                  {edge.node.name}
                </span>{" "}
                ({((edge.size / repo.languages.totalSize) * 100).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}