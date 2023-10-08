export declare class ErrorHelper {
    static BadRequestException(msg: string | string[]): void;
    static UnauthorizedException(msg: string): void;
    static NotFoundException(msg: string): void;
    static ForbiddenException(msg: string): void;
    static InternalServerErrorException(msg: string): void;
    static ConflictException(msg: string): void;
}
