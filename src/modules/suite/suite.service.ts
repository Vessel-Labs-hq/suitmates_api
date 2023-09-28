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
        user: { connect: { id: userId } }
      },
    });
  }

  async createSuiteInformation(data: CreateSuiteInformationDto, suite_id: number){
    const suite = await this.findOne(suite_id);
    if (suite == null || suite == undefined ) {
      ErrorHelper.BadRequestException(`No suite found`);
    }
    return this.prisma.suiteInformation.create({
      data: {
        ...data,
      suite:{connect: {id: suite.id}} 
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.suite.findFirst({
      where:{
        id
      }
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
}
