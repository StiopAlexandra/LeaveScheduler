import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import info from '../../../package.json'
const { name: clientName, version: clientVersion } = info

export default ({ wsEndPoint, authToken }) => {
	const wsClient = new SubscriptionClient(wsEndPoint, {
		lazy: true,
		reconnect: true,

		connectionParams: () => {
			return {
				clientName,
				clientVersion,
				...(authToken ? { Authorization: authToken } : {}),
			}
		},
	})

	const wsLink = new WebSocketLink(wsClient)
	return { wsLink, wsClient }
}
