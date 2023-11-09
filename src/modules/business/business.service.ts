import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBusinessDto: CreateBusinessDto, userId: number) {
    return await this.prisma.business.create({
      data:{
        business_name: createBusinessDto.business_name,
        days_of_business: createBusinessDto.days_of_business,
        occupation: createBusinessDto.occupation,
        hours_of_business_open: createBusinessDto.hours_of_business_open,
        hours_of_business_close: createBusinessDto.hours_of_business_close,
        website: createBusinessDto.website,
        license: createBusinessDto.license,
        user: {connect: {id: userId}}
      }
    });
  }

  findAll() {
    return `This action returns all business`;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  async update(userId: number, updateBusinessDto: UpdateBusinessDto) {
    const user = await this.prisma.user.findUnique({
      where:{
      id: userId,
     },
     select: {
      businesses: true
     }
    });
  
      return await this.prisma.business.update({
        where: { id: user.businesses[0].id },
        data: updateBusinessDto,
      });
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
