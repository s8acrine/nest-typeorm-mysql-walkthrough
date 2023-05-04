import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Delete } from '@nestjs/common';
import { createUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return  this.usersService.findUsers()
  }

  @Post()
  createUser(@Body() createUserDto: createUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.usersService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  async deleteUserById(
    @Param('id', ParseIntPipe) id: number, 
  ) {
    await this.usersService.deleteUser(id)
  }

}
