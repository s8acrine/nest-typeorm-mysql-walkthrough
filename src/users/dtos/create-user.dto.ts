import { IsString, Length } from "class-validator";
import { IsUserUnique } from "src/users/validators/isUserUnique";

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @IsUserUnique()
  username: string;

  @IsString()
  password: string;
}