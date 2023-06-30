import gql from 'graphql-tag';

export default gql`
  query GetNotifications($filter: NotificationFilter) {
    getNotifications(filter: $filter) {
      _id
      created
      message
      sender {
        _id
        name
      }
      read {
        readAt
        reader {
          name
          _id
        }
      }
    }
  }
`;
