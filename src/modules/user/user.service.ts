import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { DateHelper, ErrorHelper, PasswordHelper, Utils } from 'src/utils';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { Prisma } from '@prisma/client';
import { StripePaymentService } from '../stripe-payment/stripe-payment.service';
import { AttachCardDto } from './dto/attach-card.dto';
import { AttachTenantDto } from './dto/attach-tenant.dto';
import { UpdateCardDto } from './dto/update-card.dto';

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private stripePaymentService: StripePaymentService,
  ) {}

  async register(userInfo: any, role: string) {
    const hashedPassword = await PasswordHelper.hashPassword(userInfo.password);

    userInfo.password = hashedPassword;
    const data: Prisma.UserCreateArgs = {
      data: {
        email: userInfo.email,
        password: userInfo.password,
        invited_by: userInfo.invited_by,
      },
    };
    const user = await this.prisma.user.create(data);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { role: role },
    });

    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        password: false,
        last_name: true,
        phone_number: true,
        avatar: true,
        bio: true,
        role: true,
        suite: true,
        documents: true,
        space: {
          include: {
            suite: true,
          },
        },
        businesses: true,
        onboarded: true,
        verified: true,
        stripe_customer_id: true,
        stripe_payment_method_id: true,
        card_last_digit: true,
        card_name: true,
        created_at: true,
        updated_at: true,
        deleted: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.user.update({
      where: { id },
      data: { deleted: new Date() },
    });
  }

  async attachTenant(attachTenantDto: AttachTenantDto, user: any) {
    const tenant = await this.prisma.user.findFirst({
      where: {
        email: attachTenantDto.email,
        invited_by: user.id,
        role: 'tenant',
      },
    });
    const owner = await this.prisma.user.findFirst({
      where: { id: user.id },
      include: {
        space: {
          include: {
            suite: true,
          },
        },
      },
    });
    
    if (!tenant || !owner) {
      ErrorHelper.NotFoundException("Resource not found");
    }

    if (owner.space && owner.space.suite) {
      const matchSuite = owner.space.suite.find(suite => suite.id == attachTenantDto.suite_id);
    
      if (matchSuite) {

        return await this.prisma.suite.update({
          where: { id: matchSuite.id  },
          data: {
            tenant: { connect: {id: tenant.id }}
          },
        });

      } else {
        ErrorHelper.NotFoundException("Suite does not belong to current owner");
      }

    } else {
      ErrorHelper.NotFoundException("Specified suite does not exist");
      ;
    }
  }

  async attachCard(user: any, attachCardDto: AttachCardDto) {
    const { customer, paymentMethod } =
      await this.stripePaymentService.createCustomerAndPaymentMethod(
        user.email,
        attachCardDto.payment_method_id,
      );
    return await this.prisma.user.update({
      where: { id: user.id },
      data: {
        stripe_customer_id: customer.id,
        stripe_payment_method_id: paymentMethod.id,
        card_last_digit: attachCardDto.card_last_digit,
        card_name: attachCardDto.card_name,
      },
    });
  }

async updateCard(updateCardDto: UpdateCardDto, user){

  const newPaymentMethodId = await this.stripePaymentService.updatePaymentMethod(updateCardDto.customer_id, updateCardDto.payment_method_id, user.stripe_payment_method_id);
  return await this.prisma.user.update({
    where: { id: user.id },
    data: {
      stripe_payment_method_id: newPaymentMethodId.id,
      card_last_digit: updateCardDto.card_last_digit,
      card_name: updateCardDto.card_name,
    },
  });
}

  async getTenants(userId: number){
    return this.prisma.user.findMany({
      where: {
        invited_by: userId
      },
      include: {
        suite: true,
        businesses: true
      }
    })
  }
}
