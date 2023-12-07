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

      await this.stripePaymentService.createSuiteProductAndPrice(
        space.space_name,
        createdSuite.suite_cost,
        ""+createdSuite.id,
        createdSuite.suite_number,
        ""+space.id
      );
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

  async findSuites(ownerId: number) {

    const space = await this.prisma.space.findFirst({
      where: {owner_id: ownerId }
    });

    const suites = await this.prisma.suite.findMany({
      where: { space_id: space.id },
    });
  
    const occupiedSuites = suites.filter(suite => suite.tenant_id !== null);
    const vacantSuites = suites.filter(suite => suite.tenant_id === null);
  
    return {
      totalOccupiedSuites: occupiedSuites.length,
      totalVacantSuites: vacantSuites.length,
    };
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

    const subscription = await this.stripePaymentService.getCurrentSubscriptionBySuiteId(tenant.stripe_customer_id, tenant.suite.id);
    await this.stripePaymentService.cancelSubscription(subscription.id)
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
    
    const removeTenant = await this.removeTenant(tenantId,ownerId);
    if(removeTenant != true){
      ErrorHelper.BadRequestException("Removing tenant from previous suite failed ")
    }

        
    //create new subscription
    const product = await this.stripePaymentService.getProductBySuiteId(suiteId);
    const price_id = await this.stripePaymentService.getPriceIdByProductId(product.id);

    const newSuite = await this.prisma.suite.update({
      where: { id: suiteId },
      data: {
        tenant: { connect: {id: tenantId }}
      },
    });
   

    await this.stripePaymentService.createSubscription(tenant.stripe_customer_id,price_id,""+suiteId);

    return newSuite;
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
    let mergedData = [];

  // Fetch suite information for each payment and merge it with the payment object
  for (let payment of rentHistory) {
    const suite = await this.prisma.suite.findUnique({
      where: {id: +payment.suiteId},
      select:{
        tenant: true
      }
    });
    const mergedObject = {...payment, ...suite};
    mergedData.push(mergedObject);
  }

  return mergedData;
  }

  async tenantRentHistory(tenant){
    const user = await this.prisma.user.findUnique({
      where: {
        id: tenant.id,
      },
      select: {
        suite: true,
      },
    });
    const rentHistory = await this.stripePaymentService.getAllPaymentsBySuiteId(""+user.suite.id);
    let mergedData = [];

  // Fetch suite information for each payment and merge it with the payment object
  for (let payment of rentHistory) {
    const suite = await this.prisma.suite.findUnique({
      where: {id: +payment.suiteId},
      select:{
        tenant: true
      }
    });
    const mergedObject = {...payment, ...suite};
    mergedData.push(mergedObject);
  }

  return mergedData;
  }

  async rentHistoryChart(owner) {
    const rentHistory = await this.ownerRentHistory(owner);
    let profits = {
      monthly: {},
      yearly: {}
  };

  rentHistory.forEach(rent => {
      if (rent.paid) {
          let date = new Date(rent.dateOfPayment);
          let year = date.getFullYear();
          let month = date.getMonth() + 1; 

          let monthKey = `${month}-${year}`;
          let yearKey = `${year}`;

          if (profits.monthly[monthKey]) {
              profits.monthly[monthKey] += rent.amount;
          } else {
              profits.monthly[monthKey] = rent.amount;
          }

          if (profits.yearly[yearKey]) {
              profits.yearly[yearKey] += rent.amount;
          } else {
              profits.yearly[yearKey] = rent.amount;
          }
      }
  });

  return profits;

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
