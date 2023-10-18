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
import { HttpResponse } from 'src/utils';
import { AuthGuard } from 'src/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { ValidatedImage } from 'src/decorators';
import { IUser, User } from 'src/decorators';
import { AttachCardDto } from './dto/attach-card.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

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
  @ValidatedImage('avatar')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
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

  @Post('/attach-card')
  async attachCard(@Body()  attachCardDto: AttachCardDto,@User() user: IUser){
    const response = await this.userService.attachCard(user,attachCardDto);
    return HttpResponse.success({
      data: response,
      message: 'Card attached successfully',
    });
  }
}
