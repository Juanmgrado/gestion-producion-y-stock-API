import {
  Check,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity.js";

@Entity("product")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({
    type: "varchar",
    length: 30,
    nullable: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: "int",
    default: 0,
    unsigned: true,
  })
  @Check(`"stock" >= 0`)
  stock!: number;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive!: boolean;

  @ManyToOne(() => User)
  user?: User;
}
