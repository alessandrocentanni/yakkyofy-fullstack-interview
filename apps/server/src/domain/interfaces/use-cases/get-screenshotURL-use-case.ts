import {GetScreenshotResponseModel} from "../../models/screenshot";

export interface GetScreenshotURLUseCase {
    execute(id: String): Promise<GetScreenshotResponseModel>
}