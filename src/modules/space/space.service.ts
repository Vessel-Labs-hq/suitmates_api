import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSuitesDto } from './dto/create-suite.dto';
import { ErrorHelper } from 'src/utils';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { StripePaymentService } from '../stripe-payment/stripe-payment.service';

@Injectable()
export class SpaceService {
  constructor(private readonly prisma: PrismaService, private stripePaymentService: StripePaymentService) {}

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

  async findOneSpace(id: number, userId?: number) {
    const where: { id: number; owner_id?: number } = { id };

    if (userId !== undefined) {
      where.owner_id = userId;
    }

    return this.prisma.space.findFirst({
      where,
    });
  }

  async updateSpace(userId: number, updateSpaceDto: UpdateSpaceDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        space: true,
      },
    });

    return await this.prisma.space.update({
      where: { id: user.space.id },
      data: updateSpaceDto,
    });
  }

  async removeSpace(id: number) {
    return await this.prisma.space.update({
      where: { id },
      data: { deleted: new Date() },
    });
  }

  async removeTenant(tenantId: number, ownerId: number) {
    console.log(tenantId, ownerId);
    const tenant = await this.prisma.user.findUnique({
      where: {
        id: tenantId,
      },
      include: {
        suite: true,
      },
    });

    const owner = await this.prisma.user.findUnique({
      where: {
        id: ownerId,
      },
      include: {
        space: true,
      },
    });

    if (tenant.suite.space_id != owner.space.id) {
      ErrorHelper.BadRequestException(`Tenant does not belong to space`);
    }

    await this.prisma.user.update({
      where: {
        id: tenantId,
      },
      data: {
        suite: {
          disconnect: true,
        },
      },
    });

    const userRequests = await this.prisma.maintenanceRequest.findMany({
      where: { user_id: tenantId },
    });

    for (const request of userRequests) {
      await this.prisma.maintenanceImages.deleteMany({
        where: { maintenance_request_id: request.id },
      });
    }

    const deletedRequests = await this.prisma.maintenanceRequest.deleteMany({
      where: { user_id: tenantId },
    });

    return true;
  }

  async tenantSuiteChange(tenantId: number,suiteId: number, ownerId: number){
    const removeTenant = await this.removeTenant(tenantId,ownerId);
    if(removeTenant != true){
      ErrorHelper.BadRequestException("Removing tenant from previous suite failed ")
    }

    return await this.prisma.suite.update({
      where: { id: suiteId },
      data: {
        tenant: { connect: {id: tenantId }}
      },
    });
  }

  async updateSuite(suiteId: number, ownerId: number,updateSuiteDto: UpdateSuiteDto){
    return  await this.prisma.suite.update({
      where:{id: suiteId},
      data: updateSuiteDto
    });
  }

  async ownerRentHistory(owner){
    const user = await this.prisma.user.findUnique({
      where: {
        id: owner.id,
      },
      select: {
        space: true,
      },
    });
    const rentHistory = await this.stripePaymentService.getAllPaymentsBySpaceId(""+user.space.id);
    return rentHistory;
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
