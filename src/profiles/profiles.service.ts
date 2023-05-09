import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>
    ) {}

  async create(id: number,
    createProfileDetails: CreateProfileParams) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user)
      throw new HttpException(
        'User not found', 
        HttpStatus.BAD_REQUEST
      )
    const newProfile = this.profileRepository.create(createProfileDetails)
    const savedProfile = await this.profileRepository.save(newProfile)
    user.profile = savedProfile
    return this.userRepository.save(user)
  }

  findAll() {
    return this.profileRepository.find();
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
