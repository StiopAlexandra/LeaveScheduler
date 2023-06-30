import gql from 'graphql-tag';

export default gql`
  mutation DeleteCompanyLeave($id: ID!) {
    deleteCompanyLeave(id: $id) {
      _id
    }
  }
`;
