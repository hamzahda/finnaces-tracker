import { User } from "./User";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne
} from "typeorm";
import { Tag } from "./Tag";
import { IsString, IsInt, IsPositive } from "class-validator";

// TODO: Add more relevant class-validator decorators
@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  @IsString() // Verify that the name is a strings
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  @IsInt() // Verify that the value is an integer
  @IsPositive() // Verify that value is positive
  value: number;

  @Column({
    default: "expense"
  })
  type: "income" | "expense";

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: number;

  @ManyToMany(
    type => Tag,
    tag => tag.transactions,
    {
      eager: true,
      cascade: true
    }
  )
  @JoinTable({ name: "transaction_tags" })
  tags: Tag[];

  @ManyToOne(
    type => User,
    user => user.transactions
  )
  user: User;
}
