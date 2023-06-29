import dotenv from 'dotenv'
dotenv.config()
const { PORT, WORKERS, MONGODB_URI, JWT_LIFE_TIME, JWT_SECRET, MAIL_USER, MAIL_PASSWORD, MAIL_HOST, MAIL_PORT, MAIL_SERVICE} = process.env;

export default {
    Workers: WORKERS || 1,
    Port: PORT,
    MongoDbURI: MONGODB_URI,
    JwtLifeTime: JWT_LIFE_TIME,
    JwtSecret: JWT_SECRET,
    MailHost: MAIL_HOST,
    MailPort: MAIL_PORT,
    MailService: MAIL_SERVICE,
    MailUser: MAIL_USER,
    MailPassword: MAIL_PASSWORD,
};