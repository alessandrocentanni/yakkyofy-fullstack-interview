import './database'
import './amqp'

import express, { Request, Response } from 'express'

import ExpressMongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import config from './config'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import xss from 'xss-clean'
import { MongoClient } from 'mongodb'

import {rabbit} from "./amqp";
import ScreenshotRouter from "./router";
import {GetScreenshotURL} from "./domain/use-cases/screenshot/get-screenshotURL";
import {StoreScreenshotURL} from "./domain/use-cases/screenshot/store-screenshotURL";
import {NoSQLDatabaseWrapper} from "./data/interfaces/data-sources/nosql-database-wrapper";
import {MongodbScreenshotDataSource} from "./data/data-sources/mongodb/mongodb-screenshot-data-source";
import {ScreenshotRepositoryImpl} from "./domain/repositories/screenshot-repository";
import {MessageBrokerWrapper} from "./messageQueue/interfaces/message-broker-wrapper";
import {RabbitMQMessageBroker} from "./messageQueue/messageBroker/rabbitMQ/rabbitmq";
import {ScreenshotMessageImpl} from "./domain/message/screenshot-message";

async function getMongoDS() {
  const client: MongoClient = new MongoClient("mongodb://localhost:27017/screenshots")
  await client.connect()
  const db = client.db("SCREENSHOT_DB");

  const screenshotDatabase: NoSQLDatabaseWrapper = {
    find: (query) => db.collection("screenshots").find(query).toArray(),
    insertOne: (doc) => db.collection("screenshots").insertOne(doc).then(result => result.insertedId)
  }

  return new MongodbScreenshotDataSource(screenshotDatabase);
}

async function getRabbit() {

  const publisher = rabbit.createPublisher({
        confirm: true,
        maxAttempts: 2,
        queues: [{queue:'screenshot',  durable: true}]
      })

  const rabbitMessageBroker: MessageBrokerWrapper = {
    send: (queue, message) => publisher.send(queue, message).then(() => ({status: "success"})).catch(() => ({status: "failed"}))
  }

  return new RabbitMQMessageBroker(rabbitMessageBroker)
}

(async () => {

  const app = express()
  app.use(helmet())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors())

// sanitize request data
  app.use(xss())
  app.use(ExpressMongoSanitize())

// gzip compression
  app.use(compression())

  if (config.ENV !== 'development') app.set('trust proxy', 1)

  const dataSource = await getMongoDS()
    const messageBroker = await getRabbit()

  // Builder instance for the ScreenshotRouter
  const screenshotMiddleWare = ScreenshotRouter(
      new StoreScreenshotURL(new ScreenshotRepositoryImpl(dataSource), new ScreenshotMessageImpl(messageBroker)),
      new GetScreenshotURL(new ScreenshotRepositoryImpl(dataSource)),
  )

  app.use("/api", screenshotMiddleWare)

// 404
  app.use((req: Request, res: Response) => res.status(404).json({ message: 'Not found' }))

  const server = app.listen(config.PORT, () => console.info('Webserver started on port ' + config.PORT))

  process.on('SIGTERM', () => {
    console.info('SIGTERM signal received: closing HTTP server')
    server.close(() => {
      console.info('HTTP server closed')
    })
  })
})()