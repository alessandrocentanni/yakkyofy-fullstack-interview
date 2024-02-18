export interface ScreenshotRequestModel {
    url: string
}

export interface ScreenshotResponseModel {
    code: number
    error?: string
    data?: Data
}

export interface Data{
    id: String
}

export interface GetScreenshotResponseModel{
    code: number
    error?: Error
    data?: ScreenshotModel
}

export interface StoreScreenshotRequestModel{}

export interface PostScreenshotRequestModel{}

export interface PostScreenshotResponseModel{
    code: number
    error: Error
}

export interface Error {
    message: string
}

export enum Status {
    Queued="queued",
    Processing="processing",
    Done="done"
}

export interface ScreenshotModel {
    id?: String
    url?: String
    file?: String
    status?: Status
}

export interface ScreenshotQueryModelResponse{
    data?: ScreenshotModel,
    error?: Error
}