import gql from 'graphql-tag';

export default gql`
  mutation AddCompany($email: String!, $name: String!) {
    addCompany(email: $email, name: $name) {
      _id
    }
  }
`;
