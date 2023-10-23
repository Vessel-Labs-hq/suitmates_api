import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSuitesDto } from './dto/create-suite.dto';
import { ErrorHelper } from 'src/utils';

@Injectable()
export class SpaceService {
  constructor(private readonly prisma: PrismaService) {}

  async createSpace(data: CreateSpaceDto, userId: number) {
    return this.prisma.space.create({
      data: {
        ...data,
        owner: { connect: { id: userId } },
      },
    });
  }

  async createSuite(data: CreateSuitesDto, space_id: number) {
    const space = await this.findOneSpace(space_id);
    if (space == null || space == undefined) {
      ErrorHelper.BadRequestException(`No space found`);
    }
    const savedSuites = [];

    for (const suiteData of data.suites) {
      const createdSuite = await this.prisma.suite.create({
        data: {
          ...suiteData,
          space: { connect: { id: space.id } },
        },
      });
      savedSuites.push(createdSuite);
    }
    return savedSuites;
  }

  async findOneSpace(id: number) {
    return this.prisma.space.findFirst({
      where: {
        id,
      },
    });
  }

  async updateSpace(id: number, updateSpaceDto: UpdateSpaceDto) {
    return await this.prisma.space.update({
      where: { id },
      data: updateSpaceDto,
    });
  }

  async removeSpace(id: number) {
    return await this.prisma.space.update({
      where: { id },
      data: { deleted: new Date() },
    });
  }

  // async retrieveSuiteMaintenanceRequest(userId: number) {
  //   try {
  //     // Step 1: Retrieve all suites by a user
  //     const userSuites = await this.prisma.suite.findMany({
  //       where: { user_id: userId },
  //     });

  //     const maintenanceRequests: any[] = [];
  //     let totalMaintenanceRequests = 0;
  //     let pendingMaintenanceRequests = 0;

  //     // Step 2: Iterate through the retrieved suites
  //     for (const suite of userSuites) {
  //       // Step 3: For each suite, retrieve its associated maintenance requests
  //       const suiteMaintenanceRequests =
  //         await this.prisma.maintenanceRequest.findMany({
  //           where: { suite_id: suite.id },
  //         });

  //       // Step 4: Filter maintenance requests to find the pending ones
  //       const pendingRequests = suiteMaintenanceRequests.filter(
  //         (request) => request.status === 'pending',
  //       );

  //       // Add the suite's maintenance requests to the result array
  //       maintenanceRequests.push(...suiteMaintenanceRequests);

  //       // Update counts
  //       totalMaintenanceRequests += suiteMaintenanceRequests.length;
  //       pendingMaintenanceRequests += pendingRequests.length;
  //     }

  //     // Step 5: Return the result
  //     return {
  //       maintenanceRequests,
  //       totalMaintenanceRequests,
  //       pendingMaintenanceRequests,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
