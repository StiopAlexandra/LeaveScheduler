import gql from 'graphql-tag'

export default gql`
    query GetUsersLeaves{
        getUsers {
            _id
            name
            department {
                _id
            }
            userLeave {
                status
                startDate
                endDate
                leaveType {
                    name
                    color
                }
            }
        }
    }
`