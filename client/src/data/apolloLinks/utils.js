import { getMainDefinition } from '@apollo/client/utilities';

export const isOperationType = (type) => (operation) => {
  const { query } = operation;
  const { kind, operation: operationType } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operationType === type;
};

export const isQuery = isOperationType(`query`);
export const isMutation = isOperationType(`mutation`);
export const isSubscription = isOperationType(`subscription`);
