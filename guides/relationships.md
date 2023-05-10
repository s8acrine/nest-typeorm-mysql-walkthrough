# One-to-One Relationships

We can now perform some basic functionality with our Users entity, but we will need to add a second entity to our database in order to demonstrate how to work with relationships in Nest.js and TypeORM effectively.

For this purpose, we will create a Profiles entity, which will have a one-to-one relationship with our Users entity. This allows us to store information on our users in a seperate table.

## Creating the entity using the resource generator

While you can certainly follow the above process for creating a new entity, the nest.js cli has a command that will create your your modul, entity, service, and controller files for you, and set up basic CRUD endpoints. We will use this command to create our second entity.

It will ask you what transport layer you will use, since we are using REST API, we will select that and hit enter.
You will next be asked if you would like to generate CRUD endpoints, we will select yes.

```
nest g resource profiles
? What transport layer do you use?
❯ REST API
  GraphQL (code first)
  GraphQL (schema first)
  Microservice (non-HTTP)
  WebSockets

? Would you like to generate CRUD entry points? Yes
CREATE src/profiles/profiles.controller.spec.ts (596 bytes)
CREATE src/profiles/profiles.controller.ts (957 bytes)
CREATE src/profiles/profiles.module.ts (268 bytes)
CREATE src/profiles/profiles.service.spec.ts (474 bytes)
CREATE src/profiles/profiles.service.ts (651 bytes)
CREATE src/profiles/dto/create-profile.dto.ts (33 bytes)
CREATE src/profiles/dto/update-profile.dto.ts (181 bytes)
CREATE src/profiles/entities/profile.entity.ts (24 bytes)
UPDATE package.json (2076 bytes)
UPDATE src/app.module.ts (711 bytes)
✔ Packages installed successfully.
```

Now we have our basic structure for our second entity, we can begin to modify it to fit our needs

## A quick note on Relationships

This section will cover the basics of relationships in Nest.js and TypeORM, but is by no means a full guide. Refer to the TypeORM documentation for more information on relationships.

## Setting up the entity

We already have an entity file set up in our profile directory, now we just need to add the required code to it.

Begin with the @Entity decorator. We will name our table user_profiles, so add that into the argument of the decorator.

Now we can start our Class declation. We will name our class Profile, and export it as such.

Inside the class, we will define our columns. We will need a column for the id, which will be a primary generated column, and columns for the first and last name, which will both be strings.

src/typeorm/entities/Profile.ts

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_profiles' })
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
```

## Setting up the one-to-one relationship

Now that we have our Profile entity set up, we can set up the relationship between the two entities. Start off by opening the User entity file, and adding the @OneToOne decorator. This will take a callback function as an argument, which will return the Profile entity. We will also need to add the @JoinColumn decorator, which will join the tables together.

It is also neccessary to define what will happen if a profile is deleted. We can do this by adding the onDelete property to the @JoinColumn decorator. We will set this to SET NULL, which will set the profileId to null if the profile is deleted.

src/users/entities/user.ts

```typescript
@OneToOne(() => Profile, { onDelete: 'SET NULL' })
@JoinColumn()
profile: Profile
```

## Registering the entity

As we did for the User entity, we will need to register the Profile entity in our app.module.ts file. We will also need to import the Profile entity into our app.module.ts file.
You should now have two items in your entities array, User and Profile.:

/src/app.module.ts

```typescript
...
import { Profile } from './typeorm/entities/Profile';
...
entities: [User, Profile],
...
```

## Seeing the relationship

In your mysql cli, you should now see two tables, users and user_profiles. The user_profiles table should have an id, firstName, and lastName column.

```
mysql> describe users;
+--------------+--------------+------+-----+---------+----------------+
| Field        | Type         | Null | Key | Default | Extra          |
+--------------+--------------+------+-----+---------+----------------+
| id           | int          | NO   | PRI | NULL    | auto_increment |
| username     | varchar(255) | NO   | UNI | NULL    |                |
| password     | varchar(255) | NO   |     | NULL    |                |
| authStrategy | varchar(255) | YES  |     | NULL    |                |
| createdAt    | datetime     | NO   |     | NULL    |                |
| profileId    | int          | YES  | UNI | NULL    |                |
+--------------+--------------+------+-----+---------+----------------+
6 rows in set (0.00 sec)

mysql> describe user_profiles;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int          | NO   | PRI | NULL    | auto_increment |
| firstName | varchar(255) | NO   |     | NULL    |                |
| lastName  | varchar(255) | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
3 rows in set (0.00 sec)
```

## Setting up the Profile

Now that we have created a new entity, we need to add the functionality to interact with it. While the generate resource command has done a lot of the work for us, we need to go into our module, service, and controller files and check that they are set up correctly for our application.

## Setting up the Profile Module

Because profiles are going to be attached to a user, we will need access to both the user and profile repositories. Therefore, we need to import both of these into our Profile module. Our conroller and service files should already be set up as we used the CLI tool, but do make sure to double check:

/src/profiles/profiles.module.ts

```typescript
import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
```

## Adding the createUserProfile DTO and types

We already have a create-profile dto file, but we will need to set it up for our application.

Our DTO needs to be set up for first name, last name, and date of birth.

src/users/dto/create-profile.dto.ts

```typescript
export class CreateProfileDto {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}
```

src/users/dto/update-profile.dto.ts

```typescript
export class UpdateProfileDto {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}
```

We will also want to set up our types for create and update in our types file:

src/users/types.ts

```typescript
...
export type CreateProfileParams = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}

export type UpdateProfileParams = {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
}
```

## CRUD Scaffolding

Thanks to the generate resource command, we have a full set of basic CRUD action methods scaffolded inside our service file. We need to make the neccessary updates to these methods, but much of the work has been done for us:

```typescript
import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
```

## Create

Our first focus will be on the create action. Our goal here is to create a new profile and attach it to a user.

### Create Profile: Service

In order to create a profile, our service will need access to both the Profile and User repositories. Similar to how we set up our User service, we need to inject these repositories into our service class:

src/users/services/profiles.service.ts

```typescript
...
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @InjectRepository(User) private userRepository: Repository<User>
    ) {}
...
```

Now that we have access to both repositories, we can access the user repository to find the user we want to attach the profile to. We can then use the profile repository to create a new profile and attach it to the user. We will also need to save the user to the database.

Modify the existing create method to be asynchronous. We will also need to pass in the id of the user we want to attach the profile to. Finally, we need to attach the profile details and type it to our CreateProfileParams type:

src/users/services/profiles.service.ts

```typescript
async create(id: number,
    createProfileDetails: CreateProfileParams) {}
```

Inside the create method, we need to find the user we want to attach the profile to. We can do this by using the findOne method on the user repository. We will need to pass in the id of the user we want to find.

If a user is NOT found, we want to be sure to throw an error. We can do this by using the NotFoundException from the @nestjs/common package. We can then pass in a message to be displayed if the user is not found:

src/users/services/profiles.service.ts

```typescript
const user = await this.userRepository.findOneBy({ id });
if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
```

Now that we have found the user, we can create a new profile. We can do this by using the create method on the profile repository. We will need to pass in the createProfileDetails object we are receiving from the controller. We can then update the user by attaching the profile to the user. Finally, we need to save the user to the database:

src/users/services/profiles.service.ts

```typescript
const profile = await this.profileRepository.create(createProfileDetails);
user.profile = profile;
await this.userRepository.save(user);
```

### Create Profile: Controller

Now that we have set up our service, we need to update our controller to use the new create method. We can use the :id paramater to add to our @Post endpoint.
In order to create a profile, we will need the id of a user to assosciate it with, as well as the profile details. We can use the @Body decorator to access the profile details. We can then use the @Param decorator to access the id of the user we want to attach the profile to.

Then we can call on the create method from our service, passing in the id and the createProfileDTO. We can then return the profile that was created:

src/users/controllers/profiles.controller.ts

```typescript
  @Post(':id')
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(id, createProfileDto);
  }
```

### Create Profile: Testing the endpoint

Now that we have set up our controller and service, we can test our create action. We can use Postman to test our create action. We will need to make a POST request to the following endpoint (make sure you have a user in your database and use the id of that user):

http://localhost:3000/profiles/{id_of_user}

The body of your request should follow the format of your DTO:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01"
}
```

If successful, you should see the profile that was created in your response body.

## Seeing the relationship in action: Read functionality

We have a profile created for the user, but right now, we have no way to access that informaiton. If you run a get request on the users endpoint, you will see that the profile is not included in the response.

In order to access the profile, we will need to update our read action. We will need to update the service.

In our Users service, we want our profiles to be pulled alongside our users when we perform our get request, so we need to pass in the relations option to our find method. We can then pass in the profile relation:

src/users/services/users.service.ts

```typescript
...
  findAll() {
    return this.userRepository.find({ relations: ['profile'] });
...
  }
```

Now when you run a get request on users, you will see that the profile is included in the response:

```json
[
  {
    "id": 1,
    "username": "johndoe",
    "password": "correcthorsebatterystaple",
    "createdAt": "2021-07-07T20:00:00.000Z",
    "authStrategy": "none",
    "profile": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01"
    }
  }
]
```

## Review

We now have two tables, Users and Profiles, that have a one-to-one relationship. We have set up our service and controller to create a profile and attach it to a user. We have also set up our service to pull the profile alongside the user when we perform a get request on the users endpoint.

Feel free to expand on the profile entity and complete additional CRUD actions.

For now, we will move on to setting up a new type of relationship: one-to-many.

# One-to-Many

To demonstrate the one-to-many relationship, we will be creating a new entity called Posts. Each user will be able to create multiple posts, but each post will only belong to one user.

## Create the Posts entity

To create our new Posts entity, we will need to use the Nest CLI. We can use the following command to generate a new entity:

```
$ nest g resource posts
```

This will setup a new directory with a module, controller, and service. We will also need to create a new entity. Now we need to create a new entity and our dtos.

Create the src/posts/entities/posts.entity.ts file.

Now we can set up our Post entity.

As always, we will want a primary generated column to handle our unique id.

We will also want a title, body, and a createdAt column:

src/posts/entities/posts.entity.ts

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  createdAt: Date;
}
```

### Add the entity to the App module

Now that our new entity is created, make sure we make it available to our application. Just as we did for the Profile entity, add the Post entity to the entities array in the TypeOrmModule.forRoot() method in the App module.

src/app.module.ts

```typescript
...
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'testuser',
    password: 'testuser123',
    database: 'nestjs_mysql_tutorial',
    entities: [User, Profile, Post],
    synchronize: true
  }), UsersModule, ProfilesModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
...
```

## Setting up the One-to-Many relationship on the User entity

In our User entity, we need to set up the one-to-many relationship very similar to how we set up the one-to-one relationship for our profile.

This time, we will use the @OneToMany decorator, pass in our callback function, and pass in the type of entity we want to relate to: Post, as well as the inverse side of the relationship: user.

src/users/entities/users.entity.ts

```typescript
...
  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
...
```

You may notice that your IDE is giving you an error. This is because we have not yet created the relationship on the Post entity. We will do that next.

## Setting up the One-to-Many relationship on the Post entity

In our Post entity, we need to set up the many-to-one relationship very similar to how we set up the one-to-one relationship for our profile.

We use the @ManyToOne decorator, pass in our callback function, and pass in the type of entity we want to relate to: User, as well as the inverse side of the relationship: posts:

src/posts/entities/posts.entity.ts

```typescript
...
  @ManyToOne(() => User, (user) => user.posts)
  user: User;
...
```

You should now see that the error in your IDE has gone away.

## Set up the Posts module

We are going to need access to both the User and Post entities to interact with posts, so we will need to import both of those into our Posts module using the TypeOrmModule.forFeature() method.

src/posts/posts.module.ts

```typescript
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './entities/post';
import { User } from 'src/users/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

## Setting up DTOs and Types for Posts

Create the DTO and custom Type for posts, just as we did for the other entities:

src/posts/dto/create-post.dto.ts

```typescript
export class CreatePostDto {
  title: string;
  body: string;
}
```

src/posts/dto/update-post.dto.ts

```typescript
export class UpdatePostDto {
  title: string;
  body: string;
}
```

src/posts/types/post.ts

```typescript
...
export type CreatePostParams = {
  title: string;
  content: string;
}

export type UpdatePostParams = {
  title: string;
  content: string;
}
...
```

## Set up the Posts service

We will need to inject the Post and User repository into our posts service:

src/posts/services/posts.service.ts

```typescript
...
constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
...
```

And also set up our create method.

Again, this is very similar to what we have done for the profile method.

src/posts/services/posts.service.ts

```typescript
...
  async create(id: number, createPostDetails: CreatePostParams) {
    const user = await this.userRepository.findOneBy({ id })
    if (!user)
      throw new HttpException(
        'User not found',
        HttpStatus.BAD_REQUEST
      )
    const newPost = this.postsRepository.create(createPostDetails)
    return this.userRepository.save(newPost)
  }
  ...
```

## Set up the Posts controller

Now we need to create our Post route in our controller. This should be pretty familiar by now:

src/posts/controllers/posts.controller.ts

```typescript
...
  @Post(':id/posts')
  create(
    @Param('id') id: number,
    @Body() createPostDetails: CreatePostParams
  ) {
    return this.postsService.create(id, createPostDetails)
  }
  ...
```
