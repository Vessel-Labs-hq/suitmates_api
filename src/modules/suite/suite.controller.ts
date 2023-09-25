import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuiteService } from './suite.service';
import { CreateSuiteDto } from './dto/create-suite.dto';
import { UpdateSuiteDto } from './dto/update-suite.dto';

@Controller('suite')
export class SuiteController {
  constructor(private readonly suiteService: SuiteService) {}

  @Post()
  async create(@Body() createSuiteDto: CreateSuiteDto,@Param('userId') userId: number) {
     // Call the service to create and save the suites
     for (const suiteItem of createSuiteDto.suites) {
      await this.suiteService.createSuites(suiteItem, userId);
    }
    return 'Suites created successfully';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suiteService.findOne(+id);
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
