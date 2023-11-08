// notifications/notifications.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post('create')
  // async create(@Body() createNotificationDto) {
  //   const { userId, message } = createNotificationDto;
  //   return this.notificationsService.create(userId, message);
  // }

  @Get('user/:userId')
  async findAllForUser(@Param('userId') userId: number) {
    return this.notificationsService.findAllForUser(userId);
  }
}
