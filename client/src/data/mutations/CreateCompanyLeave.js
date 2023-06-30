import gql from 'graphql-tag';

export default gql`
  mutation CreateCompanyLeave($input: CreateCompanyLeaveInput!) {
    createCompanyLeave(input: $input) {
      _id
    }
  }
`;
