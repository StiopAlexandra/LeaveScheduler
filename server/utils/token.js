import jwt from 'jsonwebtoken';

import config from '../config.js';

const create = (user) =>
    new Promise((resolve, reject) => {
        jwt.sign(
            {
                userId: user.id,
                companyId: user.company
            },
            config.JwtSecret,
            {
                expiresIn: config.JwtLifeTime,
            },
            (error, token) => {
                if (error) {
                    reject(error);
                }

                resolve(token);
            }
        );
    });

const getDecodedToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, config.JwtSecret, (error, decoded) => {
            const decodedToken = decoded;
            if (error) {
                reject(error);
            }

            if (!decodedToken.exp || !decodedToken.iat) {
                reject(new Error("Token had no 'exp' or 'iat' payload"));
            }

            resolve(decodedToken);
        });
    })
};

export default {
    create,
    getDecodedToken,
};