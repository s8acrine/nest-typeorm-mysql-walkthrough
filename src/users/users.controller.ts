import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Delete, ParseBoolPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDetailsDto } from './dtos/user-details.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return  this.usersService.findUsers()
  }

  @Get(':id')
  getUserByID(
    @Param('id', ParseIntPipe) id: number,
  ){
    return this.usersService.findUserById(id)
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.usersService.updateUser(+id, updateUserDto)
  }

  @Delete(':id')
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number, 
  ) {
    await this.usersService.deleteUser(id)
  }

}