import { CreateSuiteInformationDto } from './create-suite-information.dto';
declare const UpdateSuiteInformationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateSuiteInformationDto>>;
export declare class UpdateSuiteInformationDto extends UpdateSuiteInformationDto_base {
    suite_id: number;
}
export {};
