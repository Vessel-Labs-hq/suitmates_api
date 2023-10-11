import { Injectable } from '@nestjs/common';
import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSuiteInformationDto } from './dto/create-suite-information.dto';
import { ErrorHelper } from 'src/utils';

@Injectable()
export class SuiteService {
  constructor(private readonly prisma: PrismaService) {}

  async createSuite(data: CreateSuiteDto, userId: number) {
    return this.prisma.suite.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async createSuiteInformation(
    data: CreateSuiteInformationDto,
    suite_id: number,
  ) {
    const suite = await this.findOne(suite_id);
    if (suite == null || suite == undefined) {
      ErrorHelper.BadRequestException(`No suite found`);
    }
    return this.prisma.suiteInformation.create({
      data: {
        ...data,
        suite: { connect: { id: suite.id } },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.suite.findFirst({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateSuiteDto: UpdateSuiteDto) {
    return await this.prisma.suite.update({
      where: { id },
      data: updateSuiteDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.suite.delete({ where: { id } });
  }

  async retrieveSuiteMaintenanceRequest(userId: number) {
    try {
      // Step 1: Retrieve all suites by a user
      const userSuites = await this.prisma.suite.findMany({
        where: { user_id: userId },
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
          (request) => request.status === 'pending',
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
      throw error;
    }
  }
}
