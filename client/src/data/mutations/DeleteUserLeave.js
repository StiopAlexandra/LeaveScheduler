import gql from 'graphql-tag';

export default gql`
  mutation DeleteUserLeave($id: ID!) {
    deleteUserLeave(id: $id) {
      _id
    }
  }
`;
