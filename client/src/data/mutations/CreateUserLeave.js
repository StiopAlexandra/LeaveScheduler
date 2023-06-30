import gql from 'graphql-tag';

export default gql`
  mutation CreateUserLeave($input: CreateUserLeaveInput!) {
    createUserLeave(input: $input) {
      _id
    }
  }
`;
