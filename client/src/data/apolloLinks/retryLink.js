import { RetryLink } from '@apollo/client/link/retry';

export default new RetryLink({
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
