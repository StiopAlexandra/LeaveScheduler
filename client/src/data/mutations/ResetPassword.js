import gql from 'graphql-tag';

export default gql`
  mutation UpdatePassword($id: ID!, $password: String!) {
    resetPassword(id: $id, password: $password) {
      _id
    }
  }
`;
