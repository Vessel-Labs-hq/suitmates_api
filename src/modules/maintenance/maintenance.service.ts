import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { UserService } from '../user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { connect } from 'net';

@Injectable()
export class MaintenanceService {
  constructor(private userService: UserService,private prisma: PrismaService){}
  async createMaintenanceRequest(createMaintenanceDto: CreateMaintenanceDto,user: any) {
    
    const tenant = await this.userService.findOne(user.id);
    const maintenanceRequest = await this.prisma.maintenanceRequest.create({
      data:{
        user: {connect: {id: tenant.id}},
        suite: {connect: {id: tenant.suite?.id}},
        priority: createMaintenanceDto.priority,
        description: createMaintenanceDto.description,
        repair_date: null,
        repair_time: null,
      }
    })
    return maintenanceRequest
  }

  async createMaintenanceImage(maintenanceRequest: any,url:string){

    const maintenanceImage = await this.prisma.maintenanceImages.create({
      data:{
        url: url,
        maintenance_request: {connect: {id: maintenanceRequest.id}}
      }
    })
  }

  findAll() {
    return `This action returns all maintenance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} maintenance`;
  }

  update(id: number, updateMaintenanceDto: UpdateMaintenanceDto) {
    return `This action updates a #${id} maintenance`;
  }

  remove(id: number) {
    return `This action removes a #${id} maintenance`;
  }
}
