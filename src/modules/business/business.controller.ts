import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { IUser, User } from 'src/decorators';


@UseGuards(AuthGuard,RolesGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @Roles(Role.Tenant)
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @Roles(Role.Tenant)
  findAll() {
    return this.businessService.findAll();
  }

  @Get(':id')
  @Roles(Role.Tenant)
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(+id);
  }

  @Patch()
  @Roles(Role.Tenant)
  update(@User() user: IUser, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(+user.id, updateBusinessDto);
  }

  @Delete(':id')
  @Roles(Role.Tenant)
  remove(@Param('id') id: string) {
    return this.businessService.remove(+id);
  }
}
