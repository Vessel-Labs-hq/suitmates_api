import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { IUser, User } from 'src/decorators';
import { CreateSuitesDto } from './dto/create-suite.dto';
import { HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UpdateSuiteDto } from './dto/update-suite.dto';

@UseGuards(AuthGuard,RolesGuard)
@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @Roles(Role.Owner)
  async create(@Body() createSpaceDto: CreateSpaceDto,@User() user: IUser) {

    const space = await this.spaceService.createSpace(createSpaceDto, user.id);
    return HttpResponse.success({
      data: space,
      message: 'Space created successfully',
    });
  }

  @Post(':space_id/create-suit')
  @Roles(Role.Owner)
  async createSuit(@Body() createSuitesDto: CreateSuitesDto,@Param('space_id') space_id: string) {
    try {
    const suite = await this.spaceService.createSuite(createSuitesDto, +space_id);
    return HttpResponse.success({
      data: suite,
      message: 'Suite created successfully',
    });
  } catch (error) {
    return HttpResponse.badRequest({
      data: "",
      message: 'Failed to save suites'
    });
  }
  }
  
    @Get('/analyzed')
    @Roles(Role.Owner)
    async findSuites(@User() user: IUser) {
      const space = await this.spaceService.findSuites(+user.id);
      return HttpResponse.success({
        data: space,
        message: 'Space retrieved successfully',
      });
    }

  @Get(':id')
  @Roles(Role.Owner)
  async findOneSpace(@Param('id') id: string, @User() user: IUser) {
    const space = await this.spaceService.findOneSpace(+id,user.id);
    return HttpResponse.success({
      data: space,
      message: 'Space retrieved successfully',
    });
  }

  @Patch()
  @Roles(Role.Owner)
  async update(@Body() updateSpaceDto: UpdateSpaceDto, @User() user: IUser) {
    const suite = await this.spaceService.updateSpace(+user.id, updateSpaceDto);
    if(!suite){
      return HttpResponse.badRequest({
        data: "null",
        message: 'Space information not found',
      });
    }
    return HttpResponse.success({
      data: suite,
      message: 'Space information updated successfully',
    });
  }

  @Delete(':id')
  @Roles(Role.Owner)
  async remove(@Param('id') id: string) {
    const space = await this.spaceService.removeSpace(+id);

    return HttpResponse.success({
      data: space,
      message: 'Space deleted successfully',
    });
  }

  @Post('tenant/:id/remove')
  @Roles(Role.Owner)
  async removeTenant(@Param('id') tenantId: string,@User() owner: IUser){
    const data = await this.spaceService.removeTenant(+tenantId,+owner.id);
    return HttpResponse.success({
      data: data,
      message: 'Tenant removed successfully',
    });
  }

  @Post('/tenant/:tenantId/suite/:suiteId/change')
  @Roles(Role.Owner)
  async tenantSuiteChange(@Param('tenantId') tenantId: string,@Param('suiteId') suiteId: string,@User() owner: IUser){
    return HttpResponse.success({
      data:     await this.spaceService.tenantSuiteChange(+tenantId, +suiteId, +owner.id),
      message: 'Suite changed successfully',
    });
  }

  @Post('/update/suite/:suiteId')
  @Roles(Role.Owner)
  async updateSuite(@Body() updateSuiteDto:UpdateSuiteDto ,@Param('suiteId') suiteId: string,@User() owner: IUser){
    const suite = await this.spaceService.updateSuite(+suiteId, +owner.id,updateSuiteDto);
    return HttpResponse.success({
      data: suite,
      message: 'Suite updated successfully',
    });
  }

  @Get('/owner/rent-history')
  @Roles(Role.Owner)
  async ownerRentHistory(@User() owner: IUser){
    const response = await this.spaceService.ownerRentHistory(owner)
    return HttpResponse.success({
      data: response,
      message: 'Rent History retrieved successfully',
    });
  }

  @Get('/owner/rent-history/chart')
  @Roles(Role.Owner)
  async rentHistoryChart(@User() owner: IUser){
    const response = await this.spaceService.rentHistoryChart(owner)
    return HttpResponse.success({
      data: response,
      message: 'Rent History retrieved successfully',
    });
  }

  @Get('/tenant/rent-history')
  @Roles(Role.Tenant)
  async tenantRentHistory(@User() tenant: IUser){
    const response = await this.spaceService.tenantRentHistory(tenant)
    return HttpResponse.success({
      data: response,
      message: 'Rent History retrieved successfully',
    });
  }
}
