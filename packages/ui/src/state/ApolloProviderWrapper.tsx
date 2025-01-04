import { ReactNode } from 'react';
import { ApolloClient, ApolloProvider, concat, createHttpLink, InMemoryCache } from '@apollo/client';
import { useAuthContext } from './use-auth-context.tsx';
import { setContext } from '@apollo/client/link/context';

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthContext();

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_ENDPOINT
  });

  const authLink = setContext(async (_, { headers }) => ({
    headers: { ...headers, authorization: user ? `Bearer ${await user.getIdToken()}` : '' }
  }));

  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(authLink, httpLink)
  });
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
