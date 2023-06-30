import gql from 'graphql-tag';

export default gql`
  query GetDepartments {
    getDepartments {
      _id
      name
      maxAbsentEmployees
      color
    }
  }
`;
