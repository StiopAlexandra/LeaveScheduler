import gql from 'graphql-tag'

export default gql`
	query GetUser($id: ID!) {
		getUser(id: $id) {
			_id
			name
			email
			manager
			department {
				_id
				name
			}
			phone
			address
			role
			type
			dateOfBirth
			dateOfEmployment
		}
	}
`