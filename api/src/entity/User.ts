import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from "typeorm";
import { IsEmail, MinLength } from "class-validator";
import { Transaction } from "./Transaction";

// TODO: Add more relevant class-validator decorators
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail() // Verify that field is a valid email
  email: string;

  @Column({ select: false })
  @MinLength(8, {
    // Verify  that that password needs at least 8 characters
    message: "Password is too short"
  })
  password: string;

  @Column()
  @MinLength(3, {
    // Verify that the name needs at least 3 characters
    message: "Name is too short"
  })
  name: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @OneToMany(
    type => Transaction,
    transaction => transaction.user
  )
  transactions: Transaction[];
}
