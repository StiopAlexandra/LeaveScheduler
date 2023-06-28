import gql from 'graphql-tag'

export default gql`
    query GetUsersDashboard($filter: UserFilter){
        getUsers(filter: $filter) {
            _id
            name
            dateOfBirth
            status
            department {
                color
                name
            }
        }
    }
`