import gql from 'graphql-tag'

export default gql`
    query GetLeaveTypes($filter: LeaveTypeFilter) {
        getLeaveTypes(filter: $filter){
            _id
            name
            allowanceDays
            color
            default
        }
    }
`