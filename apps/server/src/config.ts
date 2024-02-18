// @ts-ignore
import dotenv from 'dotenv'
dotenv.config()

export default {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'r_secret',
  RABBIT_MQ: process.env.RABBIT_MQ || 'amqp://user:password@localhost:5672'
}
