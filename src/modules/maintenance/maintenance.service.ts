/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { ErrorHelper } from 'src/utils';

@Injectable()
export class MaintenanceService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}
  async createMaintenanceRequest(
    createMaintenanceDto: CreateMaintenanceDto,
    user: any,
  ) {
    const tenant = await this.userService.findOne(user.id);
    const maintenanceRequest = await this.prisma.maintenanceRequest.create({
      data: {
        user: { connect: { id: tenant.id } },
        suite: { connect: { id: tenant?.suite?.id } },
        priority: createMaintenanceDto.priority,
        description: createMaintenanceDto.description,
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

  async getMaintenanceRequestsByUser(userId: number): Promise<any> {
    try {
      // step 0: Validate User
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
      });

      if (!user) ErrorHelper.BadRequestException('User not found');

      // Step 1: Retrieve all suites by a user
      const userSuites = await this.prisma.space.findMany({
        where: { owner_id: userId },
      });

      const maintenanceRequests: any[] = [];
      let totalMaintenanceRequests = 0;
      let pendingMaintenanceRequests = 0;

      // Step 2: Iterate through the retrieved suites
      for (const suite of userSuites) {
        // Step 3: For each suite, retrieve its associated maintenance requests
        const suiteMaintenanceRequests =
          await this.prisma.maintenanceRequest.findMany({
            where: { suite_id: suite.id },
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

      // Step 5: Return the result
      return {
        maintenanceRequests,
        totalMaintenanceRequests,
        pendingMaintenanceRequests,
      };
    } catch (error) {
      console.log(error);
      ErrorHelper.InternalServerErrorException(error?.message);
    }
  }

  findAll() {
    return `This action returns all maintenance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maintenance`;
  }

  update(id: number, _updateMaintenanceDto: UpdateMaintenanceDto) {
    return `This action updates a #${id} maintenance`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintenance`;
  }
}
