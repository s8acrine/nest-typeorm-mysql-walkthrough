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
export class IsUserUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectRepository(User) private userRepository: Repository<User> ) {}
  validate(userName: any, args: ValidationArguments) {
    return this.userRepository.findOneBy({ username: userName }).then(user => {
      if (user) return false;
      return true;
    })
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return "User $value already exists. Choose another name.";
  }
}

export function IsUserUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserUniqueConstraint
    })
  }
}