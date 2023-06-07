import {ApolloProvider, ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client'
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import React from 'react'

import history from '../../utils/history';

const ApolloClientProvider = ({children, authToken}) => {

	const httpLink = createHttpLink({
		uri: 'http://localhost:4000',
	});

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

    const client = new ApolloClient({
        link: authLink.concat(errorLink.concat(httpLink)),
        cache: new InMemoryCache({
            addTypename: false
        })
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default ApolloClientProvider
