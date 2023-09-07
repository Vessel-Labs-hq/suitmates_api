import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(params: User) {
    const user = await this.userRepository.createUser({ data: params });
    return user;
  }

  async getUser(id: number) {
    const user = await this.userRepository.getUser({ where: { id } });
    return user;
  }

  async updateUser(id: number, data: User) {
    const user = await this.userRepository.updateUser({ where: { id }, data });
    return user;
  }
}
