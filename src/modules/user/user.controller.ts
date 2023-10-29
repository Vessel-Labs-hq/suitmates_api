import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ErrorHelper, HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { ValidatedImage } from 'src/decorators';
import { IUser, User } from 'src/decorators';
import { AttachCardDto } from './dto/attach-card.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AttachTenantDto } from './dto/attach-tenant.dto';

@UseGuards(AuthGuard,RolesGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  @Get('/tenants')
  @Roles(Role.Owner)
  async getTenants(@User() user: IUser){
    const response = await this.userService.getTenants(+user.id);
    return HttpResponse.success({
      data: response,
      message: 'Tenant records retrieved successfully',
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
  async findOne(@Param('id') id: string,@User() user: IUser) {
    if(user.id !== +id) {
        ErrorHelper.BadRequestException(`Bad request`);
    }
    const userData = await this.userService.findOne(+id);

    return HttpResponse.success({
      data: userData,
      message: 'User record retrieved successfully',
    });
  }

  @Patch()
  @ValidatedImage('avatar')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @User() user: IUser,
    //@ts-ignore
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (avatar) {
     
    const avatarLink = await this.awsS3Service.uploadFile(
      avatar.originalname,
      avatar.buffer,
    );
    
    updateUserDto.avatar = avatarLink;
    }
    const data = await this.userService.update(+user.id, updateUserDto);
    return HttpResponse.success({
      data: data,
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

  @Post('/attach-card')
  async attachCard(@Body()  attachCardDto: AttachCardDto,@User() user: IUser){
    const response = await this.userService.attachCard(user,attachCardDto);
    return HttpResponse.success({
      data: response,
      message: 'Card attached successfully',
    });
  }

  @Post('/attach-tenant')
  @Roles(Role.Owner)
  async attachTenant(@Body() attachTenantDto: AttachTenantDto,@User() user: IUser){
    const response = await this.userService.attachTenant(attachTenantDto,user);
    return HttpResponse.success({
      data: response,
      message: 'Tenant attached successfully',
    });
  }
}
