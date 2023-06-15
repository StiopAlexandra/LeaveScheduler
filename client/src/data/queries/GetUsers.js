import gql from 'graphql-tag'

export default gql`
    query GetUsers{
        getUsers {
            _id
            name
            email
            manager
            department {
                name
                color
            }
            phone
            address
            role
            type
            dateOfBirth
            dateOfEmployment
            status
        }
    }
`