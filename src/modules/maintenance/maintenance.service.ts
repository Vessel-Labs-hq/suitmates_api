/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { ErrorHelper } from 'src/utils';
import { MaintenanceRequest } from '@prisma/client';
import { UpdateDateStatusRequestDto } from './dto/update-date-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotificationsService } from '../notification/notifications.service';

@Injectable()
export class MaintenanceService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private notification: NotificationsService,
  ) {}
  async createMaintenanceRequest(
    createMaintenanceDto: CreateMaintenanceDto,
    user: any,
  ) {
    const tenant = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { suite: true },
    });

    if (!tenant.suite) {
      ErrorHelper.NotFoundException('User is not assigned to a suite');
    }

    const maintenanceRequest = await this.prisma.maintenanceRequest.create({
      data: {
        user: { connect: { id: tenant.id } },
        suite: { connect: { id: tenant.suite.id } },
        priority: createMaintenanceDto.priority,
        description: createMaintenanceDto.description,
        category: createMaintenanceDto.category,
        repair_date: null,
        repair_time: null,
      },
    });

    return maintenanceRequest;
  }

  async createMaintenanceImage(maintenanceRequest: any, url: string) {
    const maintenanceImage = await this.prisma.maintenanceImages.create({
      data: {
        url: url,
        maintenance_request: { connect: { id: maintenanceRequest.id } },
      },
    });
  }

  async getMaintenanceRequestsByUser(userId, options?) {
    try {
      // Step 0: Validate User
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      if (!user) ErrorHelper.BadRequestException('User not found');

      // Step 1: Retrieve all suites by a user
      const userSuites = await this.prisma.space.findUniqueOrThrow({
        where: { owner_id: userId },
        include: { suite: true },
      });
      const maintenanceRequests = [];
      let totalMaintenanceRequests = 0;
      let pendingMaintenanceRequests = 0;

      // Step 2: Iterate through the retrieved suites
      for (const suite of userSuites.suite) {
        // Step 3: For each suite, retrieve its associated maintenance requests
        const suiteMaintenanceRequests =
          await this.prisma.maintenanceRequest.findMany({
            where: { suite_id: suite.id },
            include: {
              user: true,
              suite: true,
              images: true,
              comments: {
                include: {
                  user: true,
                },
              },
            },
          });

        // Step 4: Filter maintenance requests to find the pending ones
        const pendingRequests = suiteMaintenanceRequests.filter(
          (request) => request.status === 'PENDING',
        );

        // Add the suite's maintenance requests to the result array
        maintenanceRequests.push(...suiteMaintenanceRequests);

        // Update counts
        totalMaintenanceRequests += suiteMaintenanceRequests.length;
        pendingMaintenanceRequests += pendingRequests.length;
      }

      // Step 5: Sort, filter, and paginate the result
      // const {
      //   filterStatus,
      // filterDateField,
      // filterDateFrom,
      // filterDateTo,
      // page,
      // pageSize,
      // } = options;

      // Filter the maintenance requests by status
      // if (filterStatus) {
      //   maintenanceRequests = maintenanceRequests.filter(
      //     (request) => request.status === filterStatus,
      //   );
      // }

      // Filter the maintenance requests by date range
      // if (filterDateField && filterDateFrom && filterDateTo) {
      //   maintenanceRequests = maintenanceRequests.filter((request) => {
      //     const requestDate = new Date(request[filterDateField]);
      //     return (
      //       requestDate >= new Date(filterDateFrom) &&
      //       requestDate <= new Date(filterDateTo)
      //     );
      //   });
      // }

      // Sort the maintenance requests by date (newest to oldest)
      // maintenanceRequests.sort((a, b) => {
      //   const dateA: any = new Date(a[filterDateField]);
      //   const dateB: any = new Date(b[filterDateField]);
      //   return dateB - dateA;
      // });

      // Paginate the result
      // const startIndex = (page - 1) * pageSize;
      // const endIndex = startIndex + pageSize;
      // const paginatedMaintenanceRequests = maintenanceRequests.slice(
      //   startIndex,
      //   endIndex,
      // );

      return {
        maintenanceRequests,
        totalMaintenanceRequests: maintenanceRequests.length,
        pendingMaintenanceRequests,
      };
    } catch (error) {
      console.log(error);
      ErrorHelper.InternalServerErrorException(error?.message);
    }
  }
  async getSortedMaintenanceRequests(created_at: string, status: any) {
    const maintenanceRequests = await this.prisma.maintenanceRequest.findMany({
      where: {
        ...(status && { status }),
        ...(created_at && { created_at: new Date(created_at) }),
      },
      include: {
        user: true,
        suite: true,
        images: true,
        comments: true,
      },
    });

    return maintenanceRequests;
  }
  async findAllTenantMaintenanceRequest(user: any) {
    return await this.prisma.maintenanceRequest.findMany({
      where: { user_id: user.id },
      include: {
        user: true,
        suite: true,
        images: true,
        comments: true,
      },
    });
  }

  async analyzeMaintenanceRequests(user: any) {
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
  
    const totalRequests = await this.prisma.maintenanceRequest.count({
      where: { user_id: user.id },
    });
  
    const totalRequestsOneMonthAgo = await this.prisma.maintenanceRequest.count({
      where: { user_id: user.id, created_at: { lt: oneMonthAgo } },
    });
  
    const unresolvedRequests = await this.prisma.maintenanceRequest.count({
      where: { user_id: user.id, status: 'PENDING' || 'IN_PROGRESS' },
    });
  
    const unresolvedRequestsOneMonthAgo = await this.prisma.maintenanceRequest.count({
      where: { user_id: user.id,  status: 'PENDING' || 'IN_PROGRESS' , created_at: { lt: oneMonthAgo } },
    });
  
    const totalRequestPercentageChange = totalRequestsOneMonthAgo !== 0 ? ((totalRequests - totalRequestsOneMonthAgo) / totalRequestsOneMonthAgo) * 100 : null;
  const unresolvedRequestPercentageChange = unresolvedRequestsOneMonthAgo !== 0 ? ((unresolvedRequests - unresolvedRequestsOneMonthAgo) / unresolvedRequestsOneMonthAgo) * 100 : null;

    return {
      totalRequests,
      totalRequestPercentageChange,
      unresolvedRequests,
      unresolvedRequestPercentageChange,
    };
  }

  
  async updateDateOrStatusRequest(
    id: number,
    updateDto: UpdateDateStatusRequestDto,
  ): Promise<MaintenanceRequest> {
    // Fetch the maintenance request by ID
    const maintenanceRequest = await this.findMaintenanceRequestById(id);

    // Update the fields if they are provided in the DTO
    if (updateDto.repair_date) {
      maintenanceRequest.repair_date = updateDto.repair_date;
    }
    if (updateDto.repair_time) {
      maintenanceRequest.repair_time = updateDto.repair_time;
    }
    if (updateDto.status) {
      maintenanceRequest.status = updateDto.status;
    }

    // Save the updated maintenance request
    return await this.prisma.maintenanceRequest.update({
      where: { id: maintenanceRequest.id },
      data: updateDto,
    });
  }

  async addCommentToMaintenanceRequest(
    id: number,
    createCommentDto: CreateCommentDto,
    userId: number,
  ): Promise<any> {
    // Fetch the maintenance request by ID
    const maintenanceRequest = await this.findMaintenanceRequestById(id);

    // Validate User
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (!user) ErrorHelper.BadRequestException('User not found');

    // Create a new comment
    const comment = await this.prisma.comment.create({
      data: {
        text: createCommentDto.text,
        user_id: user.id,
        maintenance_request_id: maintenanceRequest.id,
      },
    });

    // update notification
    const suiteId = maintenanceRequest.suite_id;

    const suites = await this.prisma.suite.findUnique({
      where: { id: suiteId },
      include: { space: true },
    });

    const spaceOwner = suites.space.owner_id;
    const tenant = suites.tenant_id;

    if (spaceOwner === userId) {
      await this.notification.create(
        tenant,
        `Space owner commented on a maintenace request you opened`,
        'maintenance-comment',
        String(comment.id),
      );
    }

    if (tenant === userId) {
      await this.notification.create(
        spaceOwner,
        `Your tenant commented on a maintenace request`,
        'maintenance-comment',
        String(comment.id),
      );
    }

    return comment;
  }

  private async findMaintenanceRequestById(
    id: number,
  ): Promise<MaintenanceRequest> {
    const maintenanceRequest = await this.prisma.maintenanceRequest.findUnique({
      where: { id },
    });
    if (!maintenanceRequest) {
      ErrorHelper.NotFoundException('Maintenance request not found');
    }
    return maintenanceRequest;
  }
}
