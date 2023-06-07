import { appConfigs } from '../config';

export const isAuthenticated = () => {
    const {authToken} = appConfigs
    // Check whether the current time is past the access token's expiry time

    const accessToken = localStorage.getItem(authToken);
    if (!accessToken) {
        return false;
    }
    const token = JSON.parse(atob(accessToken.split('.')[1]));
    const epochTS = Math.round(new Date().getTime() / 1000);
    return epochTS < token.exp;
};
