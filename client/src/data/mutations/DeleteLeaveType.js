import gql from 'graphql-tag';

export default gql`
  mutation DeleteLeaveType($id: ID!) {
    deleteLeaveType(id: $id) {
      _id
    }
  }
`;
