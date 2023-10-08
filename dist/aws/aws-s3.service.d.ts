/// <reference types="node" />
export declare class AwsS3Service {
    private s3;
    private bucketName;
    constructor();
    uploadFile(key: string, body: Buffer): Promise<string>;
}
