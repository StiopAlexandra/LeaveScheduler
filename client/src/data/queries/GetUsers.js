import gql from 'graphql-tag'

export default gql`
    query GetUsers{
        getUsers {
            _id
            name
            email
            manager
        }
    }
`