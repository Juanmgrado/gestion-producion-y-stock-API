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
import { MovementType } from "../types/enums.js";

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "int", nullable: false })
  quantity!: number;

  @Column({ type: "varchar", nullable: true, default: "" })
  note!: string;

  @Column({ type: "enum", enum: MovementType, nullable: false })
  typeMovement!: MovementType;

  @CreateDateColumn({ type: Date })
  createdAt!: Date;

  @ManyToOne(() => Product, (product) => product.movements, { nullable: false })
  @JoinColumn({ name: "productUuid" })
  product!: Product;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userUuid"})
  user!: User;
}