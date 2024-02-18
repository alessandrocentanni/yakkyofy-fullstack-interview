import express from "express";
import { Request, Response } from "express";
import {StoreScreenshotURLUseCase} from "./domain/interfaces/use-cases/store-screenshotURL-use-case";
import {GetScreenshotURLUseCase} from "./domain/interfaces/use-cases/get-screenshotURL-use-case";
import {ScreenshotResponseModel} from "./domain/models/screenshot";

export default function ScreenshotRouter(
    storeScreenshotURLUseCase: StoreScreenshotURLUseCase,
    getScreenshotURLUseCase: GetScreenshotURLUseCase
) {
    const router = express.Router()

    router.get('/:id', async (req: Request, res: Response) => {
        try {
            let id = req.params.id
            if (!id) {
                res.status(400).send({ message: "Invalid request" })
            }

            const result = await getScreenshotURLUseCase.execute(id)
            res.send(result)
        } catch (err) {
            res.status(500).send({ message: "Error fetching data" })
        }
    })

    router.post('/', async (req: Request, res: Response) => {
        try {
            let result: ScreenshotResponseModel = await storeScreenshotURLUseCase.execute(req.body)
            res.statusCode = 201
            res.json(result)
        } catch (err) {
            res.status(500).send({ message: "Error saving data" })
        }
    })

    return router
}