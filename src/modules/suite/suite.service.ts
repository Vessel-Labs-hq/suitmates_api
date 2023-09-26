import { Injectable } from '@nestjs/common';
import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { PrismaService } from 'src/database/prisma.service';
import { CreateSuiteInformationDto } from './dto/create-suite-information.dto';

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
    return this.prisma.suiteInformation.create({
      data: {
        ...data,
      suite:{connect: {id: suite_id}} 
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} suite`;
  }

  update(id: number, updateSuiteDto: UpdateSuiteDto) {
    return `This action updates a #${id} suite`;
  }

  remove(id: number) {
    return `This action removes a #${id} suite`;
  }
}
