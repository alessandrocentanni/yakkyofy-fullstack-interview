export interface ScreenshotDataSource{
    create(screenshotData: any): Promise<any>
    getOne(id: string): Promise<any>
}