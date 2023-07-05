import { ApolloClient, from, createHttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from 'apollo-link-ws';

import history from '../../utils/history';

const getClient = ({ authToken, setError, cache, wsEndPoint, httpEndPoint }) => {
  const retryLink = new RetryLink({
    attempts: {
      max: 2,
      retryIf: (error) => !!error
    },
    delay: {
      initial: 300,
      max: 10000,
      jitter: true
    }
  });

  const wsLink = new WebSocketLink({
    uri: wsEndPoint,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: localStorage.getItem(authToken)
      }
    }
  });

  const httpLink = createHttpLink({
    uri: httpEndPoint
  });

  const transportLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(authToken);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    setError({ networkError, graphQLErrors });
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
      });
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        history.push('/login');
      }
    }
  });

  return {
    client: new ApolloClient({
      link: from([authLink, retryLink, errorLink, transportLink]),
      cache: cache,
      defaultOptions: {
        // query: {
        //   errorPolicy: 'all'
        // },
        // mutate: {
        //   errorPolicy: 'all'
        // }
      }
    })
  };
};

export default getClient;
