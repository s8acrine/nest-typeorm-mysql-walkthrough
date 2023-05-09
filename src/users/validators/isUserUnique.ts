import { InjectRepository } from "@nestjs/typeorm";
import { ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator } 
  from "class-validator";
import { User } from "src/users/entities/user";
import { Repository } from "typeorm";

@ValidatorConstraint({ async: true })
export class UsernameUniqueness implements ValidatorConstraintInterface {
  constructor(@InjectRepository(User) private userRepository: Repository<User> ) {}
  async validate(username: any, args: ValidationArguments) {
    console.log(this.userRepository)
    const user = await this.userRepository.findOneBy({ username })
      if (user.username === username) return false;
      return true;
    }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return "User $value already exists. Choose another name.";
  }
}

export function isUserUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsernameUniqueness
    })
  }
}