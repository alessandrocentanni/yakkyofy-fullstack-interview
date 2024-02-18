import {GetScreenshotURLUseCase} from "../../interfaces/use-cases/get-screenshotURL-use-case";
import {ScreenshotRepository} from "../../interfaces/repositories/screenshot-repository";
import {GetScreenshotResponseModel} from "../../models/screenshot";

export class GetScreenshotURL implements GetScreenshotURLUseCase {
    screenshotRepository: ScreenshotRepository
    constructor(screenshotRepository: ScreenshotRepository) {
        this.screenshotRepository = screenshotRepository
    }

    async execute(id: String): Promise<GetScreenshotResponseModel> {
        //1. Fetch the data from the database
        const screenshot = await this.screenshotRepository.getScreenshot(id)
        if (screenshot === undefined || screenshot.data === undefined) {
            throw new Error("Screenshot not found")
        }

        let data: GetScreenshotResponseModel = {
            code: 200,
            data: {
                id: screenshot.data.id,
                url: screenshot.data.url,
                file: screenshot.data.file,
                status: screenshot.data.status
            }
        }

        return data
    }
}