import { type ReactNode, useMemo } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

interface ApolloProviderWrapperProps {
  children: ReactNode;
}

export function ApolloProviderWrapper({ children }: ApolloProviderWrapperProps) {
  const client = useMemo(() => {
    const httpLink = new HttpLink({
      uri: import.meta.env.VITE_GRAPHQL_URL || '/graphql',
    });

    const authLink = setContext((_, { headers }) => {
      const token = localStorage.getItem('access_token');
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    const errorLink = onError(({ graphQLErrors }) => {
      if (graphQLErrors) {
        for (const err of graphQLErrors) {
          if (err.extensions?.code === 'UNAUTHENTICATED') {
            localStorage.removeItem('access_token');
          }
        }
      }
    });

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
