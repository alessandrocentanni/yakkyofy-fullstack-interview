import {HttpStatus} from "../../../../../../utils/constants";
import {StoreScreenshotURLUseCase} from "../../interfaces/use-cases/store-screenshotURL-use-case";
import {ScreenshotModel, ScreenshotRequestModel, ScreenshotResponseModel, Status} from "../../models/screenshot";
import {ScreenshotRepository} from "../../interfaces/repositories/screenshot-repository";
import {ScreenshotMessage} from "../../interfaces/message/message";

export class StoreScreenshotURL implements StoreScreenshotURLUseCase {
    screenshotRepository: ScreenshotRepository;
    messageBroker: ScreenshotMessage;
    constructor(screenshotRepository: ScreenshotRepository, messageBroker: ScreenshotMessage) {
        this.screenshotRepository = screenshotRepository;
        this.messageBroker = messageBroker;
    }
    async execute(screenshotData: ScreenshotRequestModel): Promise<ScreenshotResponseModel> {
        if (!screenshotData.url) {
            return {
                code: HttpStatus.BAD_REQUEST,
                error: "URL is required"
            }
        }

        let dataToStore: ScreenshotModel = {
            url: screenshotData.url,
            file: "",
            status: Status.Queued
        }

        const storedResponse = await this.screenshotRepository.storeScreenshot(dataToStore);
        if (storedResponse.error) {
            return {
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                error: storedResponse.error.message
            }
        }

        let response: ScreenshotResponseModel = {
            code: HttpStatus.OK,
        }

        let id = storedResponse.data?.id || "";

        if (storedResponse.data) {
            response.data = {
                id: id
            }
        }

        await this.messageBroker.publishScreenshot(id.toString());

        return response;
    }
}