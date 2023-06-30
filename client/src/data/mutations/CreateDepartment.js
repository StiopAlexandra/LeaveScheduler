import gql from 'graphql-tag';

export default gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      _id
    }
  }
`;
