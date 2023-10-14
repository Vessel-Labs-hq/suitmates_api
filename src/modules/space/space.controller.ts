import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { IUser, User } from 'src/decorators';
import { CreateSuitesDto } from './dto/create-suite.dto';
import { HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(AuthGuard,RolesGuard)
@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @Roles(Role.Owner)
  async create(@Body() createSpaceDto: CreateSpaceDto,@User() user: IUser) {

    const space = await this.spaceService.createSpace(createSpaceDto, user.id);
    return HttpResponse.success({
      data: space,
      message: 'Space created successfully',
    });
  }

  @Post(':space_id/create-suit')
  @Roles(Role.Owner)
  async createSuit(@Body() createSuitesDto: CreateSuitesDto,@Param('space_id') space_id: string) {
    try {
    const suite = await this.spaceService.createSuite(createSuitesDto, +space_id);
    return HttpResponse.success({
      data: suite,
      message: 'Suite created successfully',
    });
  } catch (error) {
    return HttpResponse.badRequest({
      data: "",
      message: 'Failed to save suites'
    });
  }
  }

  @Get(':id')
  @Roles(Role.Owner)
  async findOneSpace(@Param('id') id: string) {
    const space = await this.spaceService.findOneSpace(+id);
    return HttpResponse.success({
      data: space,
      message: 'Space retrieved successfully',
    });
  }

  @Patch(':id')
  @Roles(Role.Owner)
  async update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    const suite = await this.spaceService.updateSpace(+id, updateSpaceDto);
    return HttpResponse.success({
      data: suite,
      message: 'Space information updated successfully',
    });
  }

  @Delete(':id')
  @Roles(Role.Owner)
  async remove(@Param('id') id: string) {
    const space = await this.spaceService.removeSpace(+id);

    return HttpResponse.success({
      data: space,
      message: 'Space deleted successfully',
    });
  }
}
