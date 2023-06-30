import gql from 'graphql-tag';

export default gql`
  subscription SubscriptionNotification {
    notificationAdded {
      message
    }
  }
`;
