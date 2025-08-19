import { gql, useQuery } from "@apollo/client";

const GET_USER_REPOS = gql`
  query GetUserRepos($login: String!) {
    user(login: $login) {
      repositories(first: 10, orderBy: { field: UPDATED_AT, direction: DESC }) {
        nodes {
          id
          name
          url
          primaryLanguage {
            name
          }
        }
      }
    }
  }
`;

export default function App() {
  // hier testweise den GitHub-Nutzernamen hart codieren
  const { data, loading, error } = useQuery(GET_USER_REPOS, {
    variables: { login: "DasNerdwork" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Repos von DasNerdwork</h1>
      <ul>
        {data.user.repositories.nodes.map((repo: any) => (
          <li key={repo.id}>
            <a href={repo.url} target="_blank" rel="noreferrer">
              {repo.name}
            </a>{" "}
            ({repo.primaryLanguage?.name ?? "No language"})
          </li>
        ))}
      </ul>
    </div>
  );
}