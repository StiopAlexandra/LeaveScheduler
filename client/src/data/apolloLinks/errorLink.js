import { onError } from '@apollo/client/link/error';

export default ({ eventBus, setError }) => {
  return onError(({ networkError, graphQLErrors }) => {
    const gqlContainsUnauthorized =
      graphQLErrors &&
      graphQLErrors.some(({ extensions }) => {
        const { code } = extensions || {};
        return code === `UNAUTHORIZED`;
      });

    if (gqlContainsUnauthorized) {
      eventBus.emit({ type: 'error:invalidSession' });
    }

    setError({ networkError, graphQLErrors });
  });
};
