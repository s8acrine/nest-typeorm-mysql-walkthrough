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

  async create(
    user_id: number,
    createProfileDetails: CreateProfileParams) 
  {
    const user = await this.userRepository.findOne({where: {id: user_id}, relations: ['profile']})
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      )
    if (user.profile)
      throw new HttpException(
        'User already has a profile',
        HttpStatus.BAD_REQUEST
      )
    const newProfile = this.profileRepository.create({...createProfileDetails})
    const savedProfile = await this.profileRepository.save(newProfile)
    user.profile = savedProfile
    return this.userRepository.save(user)
  }

  findAll() {
    return this.profileRepository.find();
  }

  async findOne(user_id: number) {
    const user = await this.userRepository.findOne({where: {id: user_id}, relations: ['profile']})
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      )
    if (!user.profile)
      throw new HttpException(
        'User does not have a profile',
        HttpStatus.NOT_FOUND
      )
        return this.profileRepository.findOne({where: {id: user.profile.id}})
  }

  async updateByUserId(user_id: number, updateProfileParams: UpdateProfileParams) {
    const user = await this.userRepository.findOne({where: {id: user_id}, relations: ['profile']})
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.NOT_FOUND
      )
    const profile = user.profile
    this.profileRepository.update(profile, {...updateProfileParams})
    return updateProfileParams
  }

  async remove(user_id: number) {
    const user = await this.userRepository.findOne({where: {id: user_id}, relations: ['profile']})
    if (!user)
    throw new HttpException(
      'User not found',
      HttpStatus.NOT_FOUND
    )
  if (!user.profile)
    throw new HttpException(
      'User does not have a profile',
      HttpStatus.NOT_FOUND
    )
    await this.profileRepository.delete({id: user.profile.id})

  }

}
