import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from '../user/user.service';
import { RegisterTenantDto } from './dto/register-tenant.dto';
import { EmailService } from './../email/email.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private userService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, userService: UserService, emailService: EmailService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        role: any;
        email: any;
        id: any;
        onboarded: any;
        verified: any;
    }>;
    register(payload: RegisterUserDto): Promise<{
        accessToken: string;
        role: any;
        email: any;
        id: any;
        onboarded: any;
        verified: any;
    }>;
    registerTenant(payload: RegisterTenantDto): Promise<{
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
    private signUserToken;
    private generateRandomString;
}
