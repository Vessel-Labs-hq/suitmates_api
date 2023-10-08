import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterTenantDto } from './dto/register-tenant.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login({ email, password }: LoginUserDto): Promise<{
        accessToken: string;
        role: any;
        email: any;
        id: any;
        onboarded: any;
        verified: any;
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        accessToken: string;
        role: any;
        email: any;
        id: any;
        onboarded: any;
        verified: any;
    }>;
    registerTenant(registerTenantDto: RegisterTenantDto): Promise<{
        id: number;
        email: string;
        first_name: string;
        password: string;
        last_name: string;
        phone_number: string;
        avatar: string;
        bio: string;
        role: string;
        onboarded: boolean;
        verified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
