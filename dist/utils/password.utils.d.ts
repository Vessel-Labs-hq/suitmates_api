export declare class PasswordHelper {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
}
