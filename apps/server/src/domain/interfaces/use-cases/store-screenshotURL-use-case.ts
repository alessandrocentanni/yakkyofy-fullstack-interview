import {ScreenshotRequestModel, ScreenshotResponseModel} from "../../models/screenshot";

export interface StoreScreenshotURLUseCase {
    execute(screenshotData: ScreenshotRequestModel): Promise<ScreenshotResponseModel>
}