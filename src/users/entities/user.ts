// required imports from typeorm
import { Post } from "src/posts/entities/post";
import { Profile } from "src/profiles/entities/profile.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// Entity decorator that defines this class as a database entity
// name option will name the table that it is assosciated with
@Entity({name: 'users'})

// exports the User class to be used throughout the application
export class User{
  // PrimaryGeneratedColumn decorator denotes this column will be automatically generated and incremented with each new instance of the User entity
  @PrimaryGeneratedColumn()
  id: number;

  // Column decorator denotes this will be a column in the table
  // Unique option requires this column to be unique
  // Not needed on the primary generatedcolumn as typeorm will handle the generation of that id
  @Column({ unique: true})
  // name of the column : data type of the column
  username: string;

  @Column()
  password: string;

  @Column()
  createdAt: Date

  // nullable option allows this column to be a null value
  @Column({ nullable: true })
  authStrategy: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}