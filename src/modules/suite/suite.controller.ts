import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards } from '@nestjs/common';
import { SuiteService } from './suite.service';
import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';
import { IUser, User } from 'src/decorators';
import { CreateSuiteInformationDto } from './dto/create-suite-information.dto';
import { HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(AuthGuard,RolesGuard)
@Controller('suite')
export class SuiteController {
  constructor(private readonly suiteService: SuiteService) {}

  @Post()
  @Roles(Role.Owner)
  async create(@Body() createSuiteDto: CreateSuiteDto,@User() user: IUser) {

    const suite = await this.suiteService.createSuite(createSuiteDto, user.id);
    return HttpResponse.success({
      data: suite,
      message: 'Suite created successfully',
    });
  }

  @Post(':suite_id/create-suit-information')
  @Roles(Role.Owner)
  async createSuitInformation(@Body() createSuiteInformationDto: CreateSuiteInformationDto,@Param('suite_id') suite_id: string) {

    const info = await this.suiteService.createSuiteInformation(createSuiteInformationDto, +suite_id);
    return HttpResponse.success({
      data: info,
      message: 'Suite information created successfully',
    });
  }

  @Get(':id')
  @Roles(Role.Owner)
  async findOne(@Param('id') id: string) {

    const suite = await this.suiteService.findOne(+id);
    return HttpResponse.success({
      data: suite,
      message: 'Suite information retrieved successfully',
    });
  }

  @Patch(':id')
  @Roles(Role.Owner)
  async update(@Param('id') id: string, @Body() updateSuiteDto: UpdateSuiteDto) {
    const suite = await this.suiteService.update(+id, updateSuiteDto);
    return HttpResponse.success({
      data: suite,
      message: 'Suite information updated successfully',
    });
  }

  @Delete(':id')
  @Roles(Role.Owner)
  async remove(@Param('id') id: string) {
    const suite = await this.suiteService.remove(+id);

    return HttpResponse.success({
      data: suite,
      message: 'Suite deleted successfully',
    });
  }
}
