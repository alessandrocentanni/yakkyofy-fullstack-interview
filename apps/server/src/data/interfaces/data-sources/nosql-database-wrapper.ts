export interface NoSQLDatabaseWrapper {
    find(query: object): Promise<any[]>
    insertOne(doc: any): Promise<string | Object>
}