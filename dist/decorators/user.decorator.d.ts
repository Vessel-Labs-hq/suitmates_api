export interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    id: number;
    role: string;
    verified: boolean;
    onboarded: boolean;
    avatar: string;
    bio: string;
}
export declare const User: (...dataOrPipes: any[]) => ParameterDecorator;
