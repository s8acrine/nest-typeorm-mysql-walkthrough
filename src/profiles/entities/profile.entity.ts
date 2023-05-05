import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'profiles'})
export class Profile{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  dateOfBirth: Date;

}