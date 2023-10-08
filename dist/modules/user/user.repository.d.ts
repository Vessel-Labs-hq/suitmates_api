import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
export declare class UserRepository {
    private prismaService;
    constructor(prismaService: PrismaService);
    createUser(params: {
        data: Prisma.UserCreateInput;
    }): Promise<User>;
    getUser(params: {
        where: Prisma.UserWhereUniqueInput;
    }): Promise<{
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
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<{
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
