import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from "typeorm";
import { Transaction } from "./Transaction";

// TODO: Add class-validator
@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  label: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @ManyToMany(
    type => Transaction,
    transaction => transaction.tags
  )
  transactions: Transaction[];
}
