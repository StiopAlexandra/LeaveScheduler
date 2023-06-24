import gql from 'graphql-tag'

export default gql`
    mutation UpdateNotification($input: UpdateNotificationInput!) {
        updateNotification(input: $input) {
            _id
        }
    }
`