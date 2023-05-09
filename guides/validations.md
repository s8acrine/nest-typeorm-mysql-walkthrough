# Validations

We have some basic actions in place, but we are not doing any validations. Let's add some validations to our application to make it a bit more robust.

## Set up the ValidationPipe

Nest.js provides a built-in Validation Pipe that we can use to validate our incoming requests. We start by installing the required dependencies from the class-validator and class-transformer packages:

```
$ npm i --save class-validator class-transformer
```

Now we can set up our ValidationPipe in our main.ts file:

src/main.ts

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

Now we can set up validation rules inside our DTO files. Let's start with the User DTO.

## Set up validation rules for the User DTO

There are a wide array of validation decorators that we can use to validate our DTOs. You can find a full list of them in the documentation for the class-validator package: https://github.com/typestack/class-validator#validation-decorators.

We will not be covering every validation option, so be sure to check this documentation if you need to validate something that we do not cover here.

Let's start by adding some validation rules to our User DTO:

We have two fields in our DTO: username and password. First we want to make sure each field is a string, which we can do with the @IsString() decorator:

src/users/dto/create-user.dto.ts

```typescript
import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
```

Now if we try to create a user with a number for the username or password, we will get an error:

```json
{
  "username": 123,
  "password": 123
}
```

```json
{
  "statusCode": 400,
  "message": ["username must be a string", "password must be a string"],
  "error": "Bad Request"
}
```

Great! Now let's add some more validation rules.

We want to make sure that the username is at least 3 characters long, and no more than 20 characters long. We can do this with the @Length() decorator:

src/users/dto/create-user.dto.ts

```typescript
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  username: string;

  @IsString()
  password: string;
}
```

## Whitelisting

Now that we can setup validation rules in our DTOs, we also should prevent any extra fields from being passed in. We can do this by passing in the whitelist: true option to our ValidationPipe:

src/main.ts

```typescript
...
app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
...
```

## Custom Validations

We can also create our own custom validation rules. Let's create a custom validation rule to make sure that the username is unique. There are quite a few steps to this so make sure not to miss anything.

### Create the Validation Class

We need to create a class to handle the constraints of our validation.

Use the @ValidatorConstraint() decorator to create a custom validation class.
We need to inject our User repository in order to compare the input to waht already exists in our database.

Then we create the validate method, which searches the repository for a user that matches the given username. If it finds one, it returns false, createing a failed validation, else it returns true.

src/users/validators/isUserUnique.validator.ts

```typescript
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { User } from 'src/users/entities/user';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
export class UsernameUniqueness implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async validate(username: any, args: ValidationArguments) {
    console.log(this.userRepository);
    const user = await this.userRepository.findOneBy({ username });
    if (user.username === username) return false;
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'User $value already exists. Choose another name.';
  }
}
```

### Create the Validation Decorator

Now we need to create a decorator to use our custom validation class.

```typescript
export function isUserUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UsernameUniqueness,
    });
  };
}
```

### Adding the decorator to our DTO

Now that the decorator has been created, we can use it in our create user DTO:

src/users/dto/create-user.dto.ts

```typescript
export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @isUserUnique()
  username: string;
```

### Setting up our User module to use the ValidationPipe

Our validation method is a providor that we need to add into our User module in the providors array:

src/users/users.module.ts

```typescript
...
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsernameUniqueness],
})
...
```

### Setting up our app module container

In order for class-validator to be able to inject our providors, we need to set up our app module container with the useContainer() method.

src/main.ts

```typescript
useContainer(app.select(AppModule), { fallbackOnErrors: true });
```
