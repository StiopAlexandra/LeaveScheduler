import gql from 'graphql-tag';

export default gql`
  mutation CreateNotification($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      _id
    }
  }
`;
