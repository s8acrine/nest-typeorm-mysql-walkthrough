import { IsString, Length } from "class-validator";
import { isUserUnique } from "src/users/validators/isUserUnique";

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @isUserUnique()
  username: string;

  @IsString()
  password: string;
}