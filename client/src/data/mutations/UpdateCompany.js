import gql from 'graphql-tag';

export default gql`
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      _id
    }
  }
`;
