import { from } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { setContext } from '@apollo/client/link/context';

export default ({ httpEndPoint, authToken }) => {
  const httpLink = new BatchHttpLink({
    uri: httpEndPoint
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(authToken ? { Authorization: authToken } : {})
      }
    };
  });

  return from([authLink, httpLink]);
};
