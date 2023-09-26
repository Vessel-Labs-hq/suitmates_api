import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuiteService } from './suite.service';
import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { IUser, User } from 'src/decorators';
import { CreateSuiteInformationDto } from './dto/create-suite-information.dto';
import { HttpResponse } from 'src/utils';


@Controller('suite')
export class SuiteController {
  constructor(private readonly suiteService: SuiteService) {}

  @Post()
  async create(@Body() createSuiteDto: CreateSuiteDto,@User() user: IUser) {

    const suite = await this.suiteService.createSuite(createSuiteDto, user.id);
    return HttpResponse.success({
      data: suite,
      message: 'Suite created successfully',
    });
  }

  @Post('create-suit-information')
  async createSuitInformation(@Body() createSuiteInformationDto: CreateSuiteInformationDto,@Param('suite_id') suite_id: string) {
    
    const info = await this.suiteService.createSuiteInformation(createSuiteInformationDto, +suite_id);
    return HttpResponse.success({
      data: info,
      message: 'Suite information created successfully',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    const suite = await this.suiteService.findOne(+id);
    return HttpResponse.success({
      data: suite,
      message: 'Suite information created successfully',
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSuiteDto: UpdateSuiteDto) {
    return this.suiteService.update(+id, updateSuiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suiteService.remove(+id);
  }
}
