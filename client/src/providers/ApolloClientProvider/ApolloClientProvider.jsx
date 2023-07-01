import { ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { useContext, useEffect, useState, useCallback } from 'react';

import ErrorContext from '../../contexts/ErrorContext';
import getClient from './ApolloClient';

const ApolloClientProvider = ({ children, authToken, wsEndPoint, httpEndPoint }) => {
  const { setError } = useContext(ErrorContext);
  const cache = new InMemoryCache({
    addTypename: false
  });
  const [client, setClient] = useState(null);

  const createClient = useCallback(
    (cache) =>
      getClient({
        wsEndPoint,
        httpEndPoint,
        authToken,
        setError,
        cache
      }),
    [authToken, setError, wsEndPoint, httpEndPoint]
  );

  useEffect(() => {
    const { client } = createClient(cache);
    setClient(client);
  }, []);

  useEffect(() => {
    return () => {
      client?.stop();
    };
  }, [client]);

  if (!client) {
    return null;
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloClientProvider;
