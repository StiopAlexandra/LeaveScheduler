import gql from 'graphql-tag'

export default gql`
    mutation UpdateUserLeave($input: UpdateUserLeaveInput!) {
        updateUserLeave(input: $input) {
            _id
        }
    }
`