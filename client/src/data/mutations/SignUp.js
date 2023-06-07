import gql from 'graphql-tag'

export default gql`
    mutation Signup($name: String!, $email: String!, $password: String!, $manager: Boolean!, $company: ID!) {
        signup(name: $name, email: $email, password: $password, manager: $manager, company: $company) {
            email,
            password
        }
    }
`