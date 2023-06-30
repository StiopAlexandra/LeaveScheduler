import gql from 'graphql-tag';

export default gql`
  mutation UpdateCompanyLeave($input: UpdateCompanyLeaveInput!) {
    updateCompanyLeave(input: $input) {
      _id
    }
  }
`;
