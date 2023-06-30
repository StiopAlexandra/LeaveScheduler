import gql from 'graphql-tag';

export default gql`
  mutation RequestResetPassword($email: String!) {
    requestResetPassword(email: $email) {
      message
    }
  }
`;
