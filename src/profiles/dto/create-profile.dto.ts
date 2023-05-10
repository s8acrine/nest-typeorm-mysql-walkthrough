import { Type } from "class-transformer";
import { IsDate, IsString, isDateString } from "class-validator";

export class CreateProfileDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @Type(() => Date)
  @IsDate()
  dateOfBirth: Date;
}
