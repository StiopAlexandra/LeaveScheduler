import dotenv from 'dotenv'
dotenv.config()
const { PORT, MONGODB_URI, WORKERS, JWT_LIFE_TIME, JWT_SECRET } = process.env;

export default {
    Port: PORT || 4000,
    MongoDbURI: MONGODB_URI || '',
    Workers: WORKERS || 1,
    JwtLifeTime: JWT_LIFE_TIME || '7d',
    JwtSecret: JWT_SECRET || 'jkdhflkjhsd',
};