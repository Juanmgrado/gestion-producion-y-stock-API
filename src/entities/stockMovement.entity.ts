import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Product } from "./product.entity.js";
import { User } from "./user.entity.js";

export enum MovementType {
  IN = "in",
  OUT = "out",
}

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "varchar", nullable: true, default: "" })
  note!: String;

  @Column({ type: "enum", enum: MovementType, nullable: false })
  movement!: MovementType;

  @CreateDateColumn({ type: Date })
  createdAt!: Date;

  @ManyToOne(() => Product, (product) => product.movements, { nullable: false })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId"})
  employee!: User;
}