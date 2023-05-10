import { IsString, Length } from "class-validator";
import { IsUserUnique } from "src/utils/validators";

export class UpdateUserDto {
  @IsString()
  @Length(3, 20)
  @IsUserUnique()
  username: string;

  @IsString()
  password: string;
}