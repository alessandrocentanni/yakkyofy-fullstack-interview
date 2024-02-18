import {ObjectId} from 'mongodb'
import puppeteer from 'puppeteer';
// @ts-ignore
import {connectToMongoDB} from './database.ts'
// @ts-ignore
import {closeRabbitMQConnection, createRabbitMQConsumer} from './rabbitmq.ts';

interface Callback {
    body: any;
}

async function startApplication() {
    try {
        const db = await connectToMongoDB();
        const consumerCallback = async (msg: Callback) => {
            try {
                const body = msg.body;
                console.log('Processing id', body);
                const query = { _id: new ObjectId(body.toString()) };
                let res = await db.collection("screenshots").findOne(query);
                console.log('Result', res);
                console.log('Inserting data into the database');
                let result = await db.collection("screenshots").updateOne(query, { $set: { status: "processing" } });
                console.log('Result update', result);
                let url = "";
                if (res && res.url) {
                    url = res.url;
                }
                const screenshot = await takeScreenshotAndGenerateBase64(url);
                await db.collection("screenshots").updateOne(query, { $set: {
                    file: screenshot,
                    status: "done"
                    }
                });

            } catch (error) {
                console.error("Error processing message:", error);
            }
        };

        const subscriber = createRabbitMQConsumer(consumerCallback);

        process.on('SIGINT', async () => {
            console.info('SIGINT signal received: closing RabbitMQ connections');
            await subscriber.close();
            await closeRabbitMQConnection();
            process.exit(0);
        });

        process.on('SIGTERM', async () => {
            console.info('SIGTERM signal received: closing RabbitMQ connections');
            await subscriber.close();
            await closeRabbitMQConnection();
            process.exit(0);
        });
    } catch (error) {
        console.error("Error starting application:", error);
    }
}

async function takeScreenshotAndGenerateBase64(url: string){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Adjust viewport and wait for the page to render if necessary
    await page.setViewport({ width: 1280, height: 800 });

    // Take a screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: true, encoding: 'binary' });

    // Close the browser
    await browser.close();
    // Convert the screenshot buffer to a base64 string
    return screenshotBuffer.toString('base64');
}

startApplication();