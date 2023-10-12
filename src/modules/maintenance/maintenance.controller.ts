import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(AuthGuard,RolesGuard)
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Roles(Role.Tenant)
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenanceService.create(createMaintenanceDto);
  }

  @Get()
  findAll() {
    return this.maintenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto) {
    return this.maintenanceService.update(+id, updateMaintenanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(+id);
  }
}
