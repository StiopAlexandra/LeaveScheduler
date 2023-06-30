import User from '../model/User.js';
import {getDecodedToken} from './token.js';

const getUser = async (req) => {
    if (!req) {
        return null;
    }

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return null;
    }

    try {
        const decodedToken = await getDecodedToken(
            authorizationHeader.replace('Bearer ', '')
        );
        return {
            user: await User.findOne({id: decodedToken.userId}),
            companyId: decodedToken.companyId
        }
    } catch (error) {
        return null;
    }
};

export default getUser;