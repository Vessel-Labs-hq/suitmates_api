import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import {AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY,AWS_REGION} from '../base/config';

@Injectable()
export class AwsS3Service {
    private s3: S3;
    private bucketName: string;

    constructor() {
        // Initialize the AWS S3 SDK
        this.s3 = new S3({
            // AWS credentials and S3 bucket configuration
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            region: AWS_REGION,
        });

        this.bucketName = 'suite-mate';
    }

    async uploadFile(key: string, body: Buffer): Promise<string> {
        try {
            // Upload the file to AWS S3 bucket
            const uploadResult = await this.s3
                .upload({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: body,
                })
                .promise();

            return uploadResult.Location;
        } catch (error) {
            // Handle error or throw custom exceptions
            throw new Error('Failed to upload file to AWS S3.'+error);
        }
    }

    // Implement other methods for interacting with AWS S3 as needed
}
