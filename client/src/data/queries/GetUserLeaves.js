import gql from 'graphql-tag'

export default gql`
    query GetUserLeaves($filter: UserLeaveFilter) {
        getUserLeaves(filter: $filter){
            _id
            status
            notes
            startDate
            endDate
            days
            leaveType {
                _id
                name
                color
            }
        }
    }
`