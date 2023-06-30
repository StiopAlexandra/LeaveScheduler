import gql from 'graphql-tag';

export default gql`
  query GetUsers($filter: UserFilter) {
    getUsers(filter: $filter) {
      _id
      name
      email
      manager
      department {
        name
        color
      }
      phone
      address
      role
      type
      dateOfBirth
      dateOfEmployment
      status
    }
  }
`;
