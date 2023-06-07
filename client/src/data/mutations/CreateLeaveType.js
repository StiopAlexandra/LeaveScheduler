import gql from 'graphql-tag'

export default gql`
    mutation CreateLeaveType($input: CreateLeaveTypeInput!) {
        createLeaveType(input: $input) {
            _id
        }
    }
`