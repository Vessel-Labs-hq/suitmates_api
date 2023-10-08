/// <reference types="multer" />
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AwsS3Service } from 'src/aws/aws-s3.service';
export declare class UserController {
    private readonly userService;
    private readonly awsS3Service;
    constructor(userService: UserService, awsS3Service: AwsS3Service);
    create(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto, avatar: Express.Multer.File): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
}
