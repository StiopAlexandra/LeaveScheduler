import gql from 'graphql-tag';

export default gql`
  query GetCompany {
    getCompany {
      _id
      name
      email
      phone
      country
      address
      timezone
      dateFormat
      timeFormat
      weekStart
      workingDays
    }
  }
`;
