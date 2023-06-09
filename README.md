Nest.js + TypeORM + mySQL Tutorial

# Initial Project Setup

## Install Nest CLI

For ease of use, it is reccommended to install the nest.js command line interface (CLI) which you can do in terminal (be sure you have a current version of npm installed)

```
$ npm i -g @nestjs/cli
```

## Create a new project

To get started, use the Nest.js CLI to create a new project, then cd into that project

```
$nest new nestjs-typeorm-mysql-tutorial
⚡  We will scaffold your app in a few seconds..

? Which package manager would you ❤️  to use? (Use arrow keys)
❯ npm
  yarn
  pnpm
```

We will use npm for this project, so select npm and hit enter. A basic file structure will be created in a few moments:

```
CREATE nestjs-typeorm-mysql-tutorial/.eslintrc.js (663 bytes)
CREATE nestjs-typeorm-mysql-tutorial/.prettierrc (51 bytes)
CREATE nestjs-typeorm-mysql-tutorial/README.md (3340 bytes)
CREATE nestjs-typeorm-mysql-tutorial/nest-cli.json (171 bytes)
CREATE nestjs-typeorm-mysql-tutorial/package.json (1960 bytes)
CREATE nestjs-typeorm-mysql-tutorial/tsconfig.build.json (97 bytes)
CREATE nestjs-typeorm-mysql-tutorial/tsconfig.json (546 bytes)
CREATE nestjs-typeorm-mysql-tutorial/src/app.controller.spec.ts (617 bytes)
CREATE nestjs-typeorm-mysql-tutorial/src/app.controller.ts (274 bytes)
CREATE nestjs-typeorm-mysql-tutorial/src/app.module.ts (249 bytes)
CREATE nestjs-typeorm-mysql-tutorial/src/app.service.ts (142 bytes)
CREATE nestjs-typeorm-mysql-tutorial/src/main.ts (208 bytes)
CREATE nestjs-typeorm-mysql-tutorial/test/app.e2e-spec.ts (630 bytes)
CREATE nestjs-typeorm-mysql-tutorial/test/jest-e2e.json (183 bytes)

✔ Installation in progress... ☕

🚀  Successfully created project nestjs-typeorm-mysql-tutorial
👉  Get started with the following commands:

$ cd nestjs-typeorm-mysql-tutorial
$ npm run start
```

cd into the newly created project

```
$ cd nestjs-typeorm-mysql-tutorial
```

## Install typeORM

We need to install the typeORM package to our project to use it:

```
$ npm install @nestjs/typeorm typeorm mysql2

added 36 packages, and audited 702 packages in 11s
```

## Create the database

With our project created, we will need a database to use. As we are using Mysql, we will create the database using the Mysql CLI

### Installing mySQL

We will only need the GPL Community version of MySQL which can be found at
https://dev.mysql.com/downloads/

You will NEED to install the MySQL Community Server
You can also install MySQL Workbench, which is a GUI for managing MySQL

### Setting up the MySQL CLI

Setting up the CLI differs based on your operating system, and some installations of MySQL Community server will perform this action for you.
Otherwhise, you will need to properly set up your $PATH and restart your shell

### enter the mysql cli with your username and the password option

```
$ mysql -u root -p
```

Enter your password

### Create the database:

Within the CLI, enter the following command

```
mysql> CREATE DATABASE nestjs_mysql_tutorial;
```

# Setting up your Project with TypeORM and creating the Post endpoint

To use TypeORM with our project, we need to import the TypeOrmModule into our app.module.ts

We will need to setup our TypeOrmModule with our server information:

- type: we will be using MySQL for this project so enter 'mysql'
- host: we will be running this project locally, so you can enter 'localhost'
- port: make sure this port matches your MySQL port, the default is 3306
- username: make sure you are using a username that is regestered with your server
- password: make sure your password is set up properly on your server
- database: enter the name of the database you created in the Create the Database step
- entities: these are the entities we will be using, for now, we have an empty array that we will add to
- synchronize: in a development environment, you can set this to true, but be aware you can lose database info if you change this set up

Your file should look something like this:

src/app.module.ts

```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'testuser',
      password: 'testuser123',
      database: 'nestjs_mysql_tutorial',
      entities: [],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## Run your project to ensure it is connected to the database

```
$ npm start
```

### You should see something like the following:

```
➜  nestjs-typeorm-mysql-tutorial git:(master) ✗ npm start

> nestjs-typeorm-mysql-tutorial@0.0.1 start
> nest start

[Nest] 72642  - 05/03/2023, 10:56:52 AM     LOG [NestFactory] Starting Nest application...
[Nest] 72642  - 05/03/2023, 10:56:52 AM     LOG [InstanceLoader] AppModule dependencies initialized +12ms
[Nest] 72642  - 05/03/2023, 10:56:52 AM     LOG [RoutesResolver] AppController {/}: +14ms
[Nest] 72642  - 05/03/2023, 10:56:52 AM     LOG [RouterExplorer] Mapped {/, GET} route +2ms
[Nest] 72642  - 05/03/2023, 10:56:52 AM     LOG [NestApplication] Nest application successfully started +2ms
```

## Creating the User entity

We'll start by creating a User entity, a common feature of many applications. This will be a good starting point to start working with the various features of the tech stack.

Entities in TypeORM are a class which communicates with your server to create tables
Setting up your entity properly allows for easy database management

- Create a new folder in the src directory called 'users'
- Create a new folder in the users directory called 'entities'
- Create a new file in the entities directory called 'user.entity.ts'

This file will define the User entity, the columns it will have, and the data types it will store.
For our user, we will want:

- To set the name of the table to 'users'. This follows standard convention and can be done by passing in name: 'users' into the @Entity decorator
- A primary key to serve as the instance identifier. TypeORM provides the @PrimaryGeneratedColumn decorator that we can use to automatically generate ids with. We use the id: number to name the table and determine the type of data it will hold
- A username. We can use the standard @Column decorator with the unique: true argument to define that this column needs to be unique in the table. Here we use username: string to set the name of the column and determine that it will hold the string data type
- A password, again we can use the standard decorator here. We use a string type here as well
- An authStrategy. If we want to use multiple types of authentication (log in with google, 2FA, etc) we can set this for each user. We will use the nullable: true argument to allow for this column to be empty.
- CreatedAt. This will track when the user was created. we will set its typing to Date

Your file should look something like this

src/typeorm/entities/User.ts

```typescript
// required imports from typeorm
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entity decorator that defines this class as a database entity
// name option will name the table that it is assosciated with
@Entity({ name: 'users' })

// exports the User class to be used throughout the application
export class User {
  // PrimaryGeneratedColumn decorator denotes this column will be automatically generated and incremented with each new instance of the User entity
  @PrimaryGeneratedColumn()
  id: number;

  // Column decorator denotes this will be a column in the table
  // Unique option requires this column to be unique
  // Not needed on the primary generatedcolumn as typeorm will handle the generation of that id
  @Column({ unique: true })
  // name of the column : data type of the column
  username: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date;

  // nullable option allows this column to be a null value
  @Column({ nullable: true })
  authStrategy: string;
}
```

## Registering the entity and setting up your TypeORMModule

Once the Entity has been created, it must be registered with your TypeOrmModule
This is done by adding User to your entities array:
Be sure to import the User entity from your typeorm/entities/User directory

app.module.ts

```typescript
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'testuser',
    password: 'testuser123',
    database: 'nestjs_mysql_tutorial',
    entities: [User],
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
```

Verify Setup to this point

enter the mysql CLI

```
$ mysql -u root -p
```

Run the command to show your tables, and you should see your users table

```
mysql> SHOW TABLES;
+---------------------------------+
| Tables_in_nestjs_mysql_tutorial |
+---------------------------------+
| users                           |
+---------------------------------+
1 row in set (0.00 sec)
```

Now use the describe command to view the schema for your users table:

```
mysql> describe users;
+--------------+--------------+------+-----+---------+----------------+
| Field        | Type         | Null | Key | Default | Extra          |
+--------------+--------------+------+-----+---------+----------------+
| id           | int          | NO   | PRI | NULL    | auto_increment |
| username     | varchar(255) | NO   | UNI | NULL    |                |
| password     | varchar(255) | NO   |     | NULL    |                |
| authStrategy | varchar(255) | YES  |     | NULL    |                |
+--------------+--------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)
```

You can see the columns we created are here, as well as the authstrategy set as null, the id set as the primary key which auto increments, and the username set as a unique key

## Working with Users in the Database

In order to interact with this database through Nest.js, we will need to create a series of classes to manage the behavior. The CLI allows for easy creation of this classes, while also managing your imports as well.

### Generate a users module and controller

In the nest CLI

```
nest g module users
nest g controller users
nest g service users
```

Now we have the classes we need to being interacting with our database

### import TypeORM into the users module

Our first task is to import TypeORM into our users module, as well as defining the controllers and providors we will be using with our users module.
We need to add the TypeOrmModule to our imports array, using the .forFeature method with the argument of [User] to let the module know we will be using the User entity.

As we used the CLI to create our controller and service, we should see those classes already in the controller and providers arrays, respectively. If not, make sure to add them, your file should look like this:

users.module.ts

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user';

@Module({
  // add the TypeOrmModule.forFeature with the argument of the entities we will want to use in the module. As this is the users module, that is the entity we want
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

### Users Controller Initial Setup

Next, let's set up the users controller:
The users controller will handle our routes

We start off by importing the neccessary modules from @nestjs, Controller, and Post

We define this class as a controller through use of the @Controller decorator with the argument of 'users' as that is the endpoint we will be using

Inside the class declaration, we are going to add the @Post() decorator alongside the name of the method that will handle the request. We will be building on this in the future, but for now we can can just name the createUser method (which we will define and build later)

users.controller.ts

```typescript
import { Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  createUser() {}
}
```

### Creating Data Transfer Objects (DTO)

In order to properly transmit and retrieve data, we need to define what should be sent and retreived from the data base. We will do that through the use of Data Transfer Object files.

Create a directory in your users directory called dtos

In that directory create a file named create-user.dto.ts
In this file we only need to define username and password as strings, as the user id is generated through the use of the PrimaryGeneratedResource decorator and our date will be generated through our method when we build it

create-user.dto.ts

```typescript
export class CreateUserDto {
  username: string;
  password: string;
}
```

Now that we have this DTO we can use it in our methods to define what our methods need to use to transfer data in the proper format

### Creating Custom Types for Parameters

While DTOs will define how data is passed from the client to the controller to the service, there is often parameters that you will pass into the service that will not be placed into the database. For this reason, it is often useful to create a type to define the data you will be passing directly into the database

- Create the directory /src/utils/
- Create the file /src/utils/types.ts

In this file we can organize the custom types that we will use throughout our project. As our createUser method will need a username and a password, let's create that typing:

src/utils/types.ts

```typescript
export type CreateUserParams = {
  username: string;
  password: string;
};
```

Now we can use this throughout our project

### Setting up the Users Service

Now we have these basic routes set up, a DTO and custom type in order to manage the format of our data we can set up the methods inside the users service

By adding the @InjectRepository(User) to our constructor method, we can use the User repository inside our class and reference it easily.

Our createUser method will be receiving an argument from the controller, and we want to set this to our custom type. This will ensure that we are only pulling the information that we will be pushing to the server

Inside our method, we want to call on the create function of our repository, using our userDetails as well as setting a value for createdAt, which we can do by creating an instance of the Date class.

as the .save method returns a promise, we can simply return it when the function is called.

src/users/users.service.ts

```typescript
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

// allows for this service to be injected elsewhere
@Injectable()
export class UsersService {
  // injects the User repository to this class
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // The method used to create a user
  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }
}
```

Now that our users service has been set up with our User repository, we can pass it into the users controller:

users.controller.ts

```typescript

...
@Controller('users')
export class UsersController {
constructor(private userService: UsersService) {}
...

}
```

With the usersService passed into our UsersController, we can now call on the createUser method in Users service for our @Post route:
users.controller.ts

```typescript
...
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    this.usersService.createUser()
  }
...
```

### Building out the Controller method

With our Users service built out, we can now inject it into our controller and call on it's methods,

First, we inject the usersService into our class via the constructor method:

/src/users/users.controller.ts

```typescript
...

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
...
}
```

And we reference it in our createUser method call.
We use the @Body decorator to our createUserDto, then use that DTO as our argument as we call on the createUser method from usersService:

/src/users/users.controller.ts

```typescript
...
  @Post()
  createUser(@Body() createUserDto: createUserDto) {
    this.usersService.createUser(createUserDto)
  }
...
```

## Testing our work

We should have everything in place to create our first entry in the database, so let's test it out!

Make sure your server is running in dev mode:

```
npm run start:dev
```

There should be no errors at this point.

Using Postman or a similar API tool, send a post request to your endpoint (this should be localhost:3000/users)

Make sure you are sending JSON and it is formatted to match your DTO:
{
username: 'testuser',
password: 'test123'
}

You should receive a 201 response

Enter your MySQL cli (or MySQL Workbench) to verify the user was created:

```
mysql> select * from users;
+----+----------+----------+--------------+---------------------+
| id | username | password | authStrategy | createdAt           |
+----+----------+----------+--------------+---------------------+
|  1 | test     | test123  | NULL         | 2023-05-03 16:06:19 |
+----+----------+----------+--------------+---------------------+
1 row in set (0.00 sec)

mysql>

```

Fantastic!

# Adding additional Endpoints

Now that we have one working endpoint, it is fairly straight forward to build out additional endpoints.

## Adding the @Get endpoint

Now that we have created users in the database, let's also set up an endpoint to get user info from the database

We will need to setup the appropriate method in our service, as well as the route in our controller.

### Adding the method to our service

In our users service, we need to set up the method that will be used to get users from our database.

TypeORM repositoryies have the built in find() method which we can use with no arguments to simply retrieve all users from the database.

Because our repository has already been injected into our UsersService Class, we simply need to reference it in our method:

src/users/user.service.ts

```typescript
import { User } from 'src/typeorm/entities/user';
import { CreateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  // Adding our findUsers() method
  //----------------------------------------
  findUsers() {
    return this.userRepository.find();
  }
  //----------------------------------------

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepository.create({
      ...userDetails,
      createdAt: new Date(),
    });
    return this.userRepository.save(newUser);
  }
}
```

### Adding the route to our controller

With our get method set up, we merely need to let our controller know when to call it.

We use the @Get() decorator to identify what verb we will handle, then set up our getUsers() function, which simply calls on the findUsers function in our service and returns it:

```typescript
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //----------------------------------------
  @Get()
  getUsers() {
    return this.usersService.findUsers();
  }
  //----------------------------------------

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
```

## Adding the @Put endpoint

We can add users and retreive them from the database, so now let's set up a way to update their information

### Creating the DTO and type

We will need to format the request body of this request, so we need to create a new DTO and type for our request.

As the only thing we will be updating is the username and password, we can effictively copy the implementation from our createUserDto and createUserParams:

src/users/dtos/update-user.dto.ts

```typescript
export class UpdateUserDto {
  username: string;
  password: string;
}
```

src/utils/types.ts

```typescript
export type CreateUserParams = {
  username: string;
  password: string;
};

export type UpdateUserParams = {
  username: string;
  password: string;
};
```

### Adding the method to our service

For our updateUser method, we will need two arguments, the id of the user to update (id: number), and the actual data to be updated. (updateUserDetails: UpdateUserParams)

In the body of the method, we will call on the update method for our userRepository (remember that the repository was injected into our class in the previous section when we set up the controller initially), and pass in the id and updateUserDetails (using the spread operator)

As the update returns a promise we can return this promise to the controller

Your method should look as such:

src/users/users.service.ts

```typescript
updateUser(id: number, updateUserDetails: UpdateUserParams) {
  return this.userRepository.update({ id }, { ...updateUserDetails })
}
```

### Adding the route to our controller

We can use the @Patch decorator to denote our HTTP verb
Because we now need to know WHAT user we are updating, we need to add a route suffix to this endpoint. We do this by adding the :id argument to our Put decorator

Now we add our controller method, since we are updating a user that we will find by id, let's name it updateUserByID. We will set this method to be async, so we can await the promise from our service method

Our method needs the id that we are going to update, so we can use the @Param decorator to let the method know to get this information from the url params.

To make sure that what we receive is actually an integer, we also add the ParseIntPipe to the argument. This will invoke the ParseIntPipe, which is injected into your argument and reads the argument passed to your method. In the case of ParseIntPipe, it will read the argument and attempt to transform it into an integer, or throw an error if it is unable to do so. If it throws an error, the method WILL NOT BE CALLED.

Finally, we type our param with the number type.

Your method should look like so:

src/users/users.controller.ts

```typescript
  @Patch(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    await this.usersService.updateUser(id, updateUserDto)
  }
```

### Checking our work

We now should be able to use the /users endpoint to get a list of all users and add a new user

We can also now use the /users/:id endpoint to update a single users details

## Adding the @Delete endpoint

At this point, we should be fairly comfortable with this process, creating the DTO and type when needed, creating the method in our service, and adding the route to our controller. We can also re-use much of the code we have written so far, which is what we will do for the Delete endpoint:

### Adding the method to our service

Our delete method can be built in the same way as our update method. We will only need the argument for id, so we can copy over our logic from updateUser and remove the updateUserDetails from our arguments:

src/users/users.service.ts

```typescript
deleteUser(id: number) {
  return this.userRepository.delete({ id })
}
```

### Adding the route to our controller

And we can follow a similar procedure for our controller:

src/user/users.controller.ts

```typescript
@Delete(':id')
async deleteUserById(
  @Param('id', ParseIntPipe) id: number,
) {
  await this.usersService.deleteUser(id)
}
```

And now we should be able to delete a user from our database using the /users/:id endpoint.

# Next Steps

By now, you should have a functioning API that can create, read, update, and delete users from a database. You should also have a good understanding of how to use NestJS to create a REST API.

It is important to note there are many more stages of development that would be required for a production ready API. My hope is to continue to add more to this project to take you to that point. For now, If you would like to continue with this project, the guides folder contains information on how to continue to build out your api. A suggested order is provided below:

1. Relationships - v1.0 05/09/2023
2. Validation - V1.0 05/09/2023
3. Authentication - TODO
4. Authorization - TODO
5. Testing - TODO
6. Deployment - TODO
