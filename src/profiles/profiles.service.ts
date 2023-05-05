import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateProfileParams, UpdateProfileParams } from 'src/utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { User } from 'src/users/entities/user';

@Injectable()
export class ProfilesService {

  constructor(
    @InjectRepository(Profile) private userRepository: Repository<Profile>) {}
    @InjectRepository(User) private profileRepository: Repository<User>) {}

  create(id: number,
    profileDetails: CreateProfileParams) {
    const user = await this.userRepository.findOneBy({ id })
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileParams: UpdateProfileParams) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
