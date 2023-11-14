// notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/database/prisma.service';
import { ErrorHelper } from 'src/utils';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    message: string,
    service: string,
    serviceId?: string,
  ) {
    // Validate User
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!user) ErrorHelper.BadRequestException('User not found');

    return this.prisma.notification.create({
      data: {
        user_id: userId,
        text: message,
        opened: false,
        service,
        serviceId: Number(serviceId) || null,
      },
    });
  }

  async findAllForUser(userId: number) {
    // Validate User
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!user) ErrorHelper.BadRequestException('User not found');

    return this.prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const users = await this.prisma.user.findMany({
        where: {
          last_payment_date: {
            gte: today,
            lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      if (users.length > 0) {
        await this.sendNotificationsToUsers(users);
      }
    } catch (error) {
      ErrorHelper.InternalServerErrorException((error as Error).message);
    }
  }

  // Function to send notifications to users
  async sendNotificationsToUsers(users: User[]) {
    for (const user of users) {
      const remainingDays = this.calculateRemainingDays(user.last_payment_date);
      let notificationMessage = '';

      if (remainingDays > 0) {
        notificationMessage = `You have ${remainingDays} days until your payment is due.`;
      } else {
        notificationMessage =
          'Your payment is due. Please make your payment as soon as possible.';
      }

      // Create a notification for the user
      await this.create(user.id, notificationMessage, 'payment');
    }
  }

  // Function to calculate remaining days
  private calculateRemainingDays(targetDate: Date): number {
    const currentDate = new Date();
    const remainingTime = targetDate.getTime() - currentDate.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    return remainingDays;
  }
}
