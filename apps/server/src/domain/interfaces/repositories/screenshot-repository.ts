import {
    GetScreenshotResponseModel,
    ScreenshotModel,
    ScreenshotQueryModelResponse,
} from "../../models/screenshot";

export interface ScreenshotRepository {
    storeScreenshot(screenshotData: ScreenshotModel): Promise<ScreenshotQueryModelResponse>
    getScreenshot(id: String): Promise<GetScreenshotResponseModel>
}