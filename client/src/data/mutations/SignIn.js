import gql from 'graphql-tag'

export default gql`
    mutation SignIn($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            token
            user {
                _id
                email
                name
                manager
                company {
                    _id
                    timezone
                    dateFormat
                    timeFormat
                    weekStart
                    workingDays
                }
            }
        }
    }
`