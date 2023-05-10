import { Type } from "class-transformer";
import { IsString, IsDate } from "class-validator";

export class UpdateProfileDto{
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;
}
