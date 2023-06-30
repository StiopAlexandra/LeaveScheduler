import gql from 'graphql-tag';

export default gql`
  query GetUserLeaves($filter: UserLeaveFilter) {
    getUserLeaves(filter: $filter) {
      _id
      status
      notes
      startDate
      endDate
      days
      reason
      leaveType {
        _id
        name
        color
        allowanceDays
      }
      user {
        _id
        name
        department {
          name
          color
        }
      }
    }
  }
`;
