import gql from 'graphql-tag'

export default gql`
    mutation UpdateLeaveType($input: UpdateLeaveTypeInput!) {
        updateLeaveType(input: $input) {
            _id
        }
    }
`