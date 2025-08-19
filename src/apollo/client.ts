import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/.netlify/functions/githubGraphql",
  }),
  cache: new InMemoryCache(),
});

export default client;
