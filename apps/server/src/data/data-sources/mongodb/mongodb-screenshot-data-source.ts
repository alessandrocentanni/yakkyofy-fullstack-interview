import {ObjectId} from "mongodb";
import {ScreenshotDataSource} from "../../interfaces/data-sources/screenshot-data-source";
import {NoSQLDatabaseWrapper} from "../../interfaces/data-sources/nosql-database-wrapper";
import {
    GetScreenshotResponseModel,
    ScreenshotModel,
    ScreenshotQueryModelResponse
} from "../../../domain/models/screenshot";
import {HttpStatus} from "../../../../../../utils/constants";

export class MongodbScreenshotDataSource implements ScreenshotDataSource {
    private db: NoSQLDatabaseWrapper
    constructor(db: NoSQLDatabaseWrapper) {
        this.db = db
    }

    async create(screenshotData: ScreenshotModel): Promise<ScreenshotQueryModelResponse> {
        let result = await this.db.insertOne(screenshotData);
        console.log('Result', result);
        let response: ScreenshotQueryModelResponse = {}

        if (result === undefined) {
            response.error = {
                message: "Error while storing the screenshot"
            }
            return response;
        }

        response.data = {
            id: result.toString()
        }

        return response;
    }

    async getOne(id: String): Promise<GetScreenshotResponseModel> {
        let query = {
            _id: new ObjectId(id.toString())
        }
        let data = await this.db.find(query);
        let result: GetScreenshotResponseModel = {code: HttpStatus.OK};
        if (data === undefined) {
            result.code = HttpStatus.INTERNAL_SERVER_ERROR;
            result.error = {
                message: "Error while fetching the screenshot"
            }
            return result;
        }
        if (data.length === 1) {
            result.data = {
                id: data[0]._id.toString(),
                url: data[0].url,
                file: data[0].file,
                status: data[0].status
            }
        }

        return result;
    }
}