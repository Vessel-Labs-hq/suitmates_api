import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UploadedFiles, Query,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
// import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { ValidatedImages } from 'src/decorators';
import { IUser, User } from 'src/decorators';
import { HttpResponse } from 'src/utils/http-response.utils';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { UpdateDateStatusRequestDto } from './dto/update-date-status.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SortMaintenanceDto } from './dto/sort-maintenace.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(
    private readonly maintenanceService: MaintenanceService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Post()
  @ValidatedImages('images')
  @Roles(Role.Tenant)
  async create(
    @Body() createMaintenanceDto: CreateMaintenanceDto,
    @UploadedFiles() images: Express.Multer.File[],
    @User() user: IUser,
  ) {
    const result = await this.maintenanceService.createMaintenanceRequest(
      createMaintenanceDto,
      user,
    );
    if (Array.isArray(images) && images.length) {
      for (const image of images) {
        const uploadedImage = await this.awsS3Service.uploadFile(
          image.originalname,
          image.buffer,
        );
        await this.maintenanceService.createMaintenanceImage(
          result,
          uploadedImage,
        );
      }
    }
    return HttpResponse.success({
      data: result,
      message: 'Maintenance request created successfully',
    });
  }

  @Get()
  @Roles(Role.Tenant)
  async findAll(@User() user: IUser) {
    return HttpResponse.success({
      data: await this.maintenanceService.findAllTenantMaintenanceRequest(user),
      message: 'Maintenance request sorted successfully',
    });
  }

  @Get(':userId')
  getOwnerMaintenanceBoard(@Param('userId') userId: string) {
    return this.maintenanceService.getMaintenanceRequestsByUser(+userId);
  }

  @Patch(':id')
  async updateMaintenanceRequest(
    @Param('id') id: number,
    @Body() updateDto: UpdateDateStatusRequestDto,
  ) {
    return this.maintenanceService.updateDateOrStatusRequest(id, updateDto);
  }

  @Get()
  async getSortedMaintenanceRequests(
    @Query() query: SortMaintenanceDto,
  ) {
    const { status, created_at } = query;
    const data = await this.maintenanceService.getSortedMaintenanceRequests(status, created_at);
    return HttpResponse.success({
      data: data,
      message: 'Maintenance request sorted successfully',
    });
  }

  @Post(':id/comments')
  async addCommentToMaintenanceRequest(
    @Param('id') id: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.maintenanceService.addCommentToMaintenanceRequest(
      id,
      createCommentDto,
      1, //change
    );
  }
}
