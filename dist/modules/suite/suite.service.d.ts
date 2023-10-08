import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSuiteInformationDto } from './dto/create-suite-information.dto';
export declare class SuiteService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSuite(data: CreateSuiteDto, userId: number): Promise<{
        id: number;
        user_id: number;
        space_name: string;
        space_address: string;
        space_size: number;
        space_amenities: string;
        account_number: string;
        account_name: string;
        routing_number: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createSuiteInformation(data: CreateSuiteInformationDto, suite_id: number): Promise<{
        id: number;
        suite_number: string;
        suite_type: string;
        suite_size: string;
        suite_cost: number;
        timing: string;
        suite_id: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: number): Promise<{
        id: number;
        user_id: number;
        space_name: string;
        space_address: string;
        space_size: number;
        space_amenities: string;
        account_number: string;
        account_name: string;
        routing_number: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateSuiteDto: UpdateSuiteDto): Promise<{
        id: number;
        user_id: number;
        space_name: string;
        space_address: string;
        space_size: number;
        space_amenities: string;
        account_number: string;
        account_name: string;
        routing_number: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        user_id: number;
        space_name: string;
        space_address: string;
        space_size: number;
        space_amenities: string;
        account_number: string;
        account_name: string;
        routing_number: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
