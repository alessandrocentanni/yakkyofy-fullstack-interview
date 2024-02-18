export interface ScreenshotMessage {
    publishScreenshot(id: string): Promise<any>
}