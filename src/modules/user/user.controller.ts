import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await  this.userService.register(createUserDto);

    return HttpResponse.success({
      data: user,
      message: 'User created successfully',
    });
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();

    return HttpResponse.success({
      data: users,
      message: 'Users record retrieved successfully',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);

    return HttpResponse.success({
      data: user,
      message: 'User record retrieved successfully',
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(+id, updateUserDto);
    return HttpResponse.success({
      data: user,
      message: 'User updated successfully',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.userService.remove(+id);
    return HttpResponse.success({
      data: user,
      message: 'User created successfully',
    });
  }
}
