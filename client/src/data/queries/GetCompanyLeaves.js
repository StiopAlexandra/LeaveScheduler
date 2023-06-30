import gql from 'graphql-tag';

export default gql`
  query GetCompanyLeaves {
    getCompanyLeaves {
      _id
      title
      startDate
      endDate
      leaveType {
        _id
        name
        color
      }
    }
  }
`;
