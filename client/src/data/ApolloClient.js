import { ApolloClient, from, createHttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from 'apollo-link-ws';
import {setContext} from '@apollo/client/link/context';
import history from "../utils/history";
import {onError} from '@apollo/client/link/error';
import retryLink from "./apolloLinks/retryLink";

const getClient = ({ authToken,  setError, cache }) => {

	const wsLink = new WebSocketLink({
		uri: `ws://localhost:4000/graphql`,
		options: {
			reconnect: true,
			connectionParams: {
				Authorization: localStorage.getItem(authToken)
			},
		}
	});

	const httpLink = createHttpLink({
		uri: 'http://localhost:4000/graphql',
	});

	const transportLink = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query);
			return kind === 'OperationDefinition' && operation === 'subscription';
		},
		wsLink,
		httpLink,
	);

	const authLink = setContext((_, {headers}) => {
		const token = localStorage.getItem(authToken);
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : '',
			},
		};
	});

	const errorLink = onError(({graphQLErrors, networkError}) => {
		setError({ networkError, graphQLErrors })
		if (graphQLErrors) {
			graphQLErrors.forEach(({message, locations, path}) => {
				console.log(
					`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
				);
			});
		}
		if (networkError) {
			console.log(`[Network error]: ${networkError}`);
			if ('statusCode' in networkError && networkError.statusCode === 401) {
				history.push('/login');
			}
		}
	});

	return {
		client: new ApolloClient({
			link: from([authLink, retryLink, errorLink, transportLink]),
			cache: cache
		}),
	}
}

export default getClient
