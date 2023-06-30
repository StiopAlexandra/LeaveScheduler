import gql from 'graphql-tag';

export default gql`
  mutation DeleteDepartment($id: ID!) {
    deleteDepartment(id: $id) {
      _id
    }
  }
`;
