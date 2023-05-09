import { IsString, Length } from "class-validator";
import { isUserUnique } from "../validators/isUserUnique";


export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @isUserUnique()
  username: string;

  @IsString()
  password: string;
}