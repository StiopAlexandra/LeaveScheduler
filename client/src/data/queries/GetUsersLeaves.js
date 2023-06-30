import gql from 'graphql-tag';

export default gql`
  query GetUsersLeaves {
    getUsers {
      _id
      name
      department {
        _id
      }
      userLeave {
        days
        status
        startDate
        endDate
        leaveType {
          _id
          name
          color
        }
      }
    }
  }
`;
