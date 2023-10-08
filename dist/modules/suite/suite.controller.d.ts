import { SuiteService } from './suite.service';
import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { IUser } from 'src/decorators';
import { CreateSuiteInformationDto } from './dto/create-suite-information.dto';
export declare class SuiteController {
    private readonly suiteService;
    constructor(suiteService: SuiteService);
    create(createSuiteDto: CreateSuiteDto, user: IUser): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    createSuitInformation(createSuiteInformationDto: CreateSuiteInformationDto, suite_id: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    update(id: string, updateSuiteDto: UpdateSuiteDto): Promise<{
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
