import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  CreateDateColumn,
  ManyToOne
} from "typeorm";
import { Product } from "./product.entity.js";
import { User } from "./user.entity.js";

enum MovementType {
  IN = "in",
  OUT = "out",
}

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  
  @Column({type: "int"})
  quantity!: number;
  
  @Column({ type: "enum", enum: MovementType, nullable: false })
  movement!: MovementType;
  
  @CreateDateColumn({type: Date})
  createdAt!: Date;

  @ManyToOne(() => Product)
  product!: Product;

  @ManyToOne(() => User)
  employee!: User;
}