interface MyObject {
    [key: string]: any;
}
export declare class Utils {
    static isEmailOrFail(email: string): string;
    static isEmail(email: string): boolean;
    static removeKeysFromObject(obj: MyObject, keysToRemove: string[]): MyObject;
    static deleteEmptyFields(obj: any): any;
    static waitForTime: (milliseconds: number) => Promise<void>;
}
export {};
