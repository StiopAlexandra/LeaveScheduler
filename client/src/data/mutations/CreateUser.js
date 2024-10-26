import gql from 'graphql-tag';

export default gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        _id
      }
    }
  }
`;
