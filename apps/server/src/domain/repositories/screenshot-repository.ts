import {ScreenshotRepository} from "../interfaces/repositories/screenshot-repository";
import {MongodbScreenshotDataSource} from "../../data/data-sources/mongodb/mongodb-screenshot-data-source";
import {
    GetScreenshotResponseModel,
    ScreenshotModel,
    ScreenshotQueryModelResponse,
    ScreenshotRequestModel,
    ScreenshotResponseModel
} from "../models/screenshot";

export class ScreenshotRepositoryImpl implements ScreenshotRepository {
    screenshotDataSource: MongodbScreenshotDataSource
    constructor(screenshotDataSource: MongodbScreenshotDataSource) {
        this.screenshotDataSource = screenshotDataSource
    }

    async storeScreenshot(screenshotData: ScreenshotModel): Promise<ScreenshotQueryModelResponse> {
       return await this.screenshotDataSource.create(screenshotData);
    }

    async getScreenshot(id: String): Promise<GetScreenshotResponseModel> {
        return await this.screenshotDataSource.getOne(id);
    }
}