import gql from 'graphql-tag'

export default gql`
    mutation UpdateDepartment($input: UpdateDepartmentInput!) {
        updateDepartment(input: $input) {
            _id
        }
    }
`