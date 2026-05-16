import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./product.entity.js";
import { User } from "./user.entity.js";

@Entity("stock_adjustment")
export class StockAdjustment {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @ManyToOne(() => Product, (product) => product.adjustments, {
    nullable: false,
  })
  @JoinColumn({ name: "productId" })
  product!: Product;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: "adjustedById" })
  adjustedBy!: User;

  @Column({ type: "uuid" })
  productId!: string;

  @Column({ type: "uuid" })
  adjustedById!: string;

  @Column({ type: "int" })
  expectedStock!: number;

  @Column({ type: "int"})
  actualStock!: number;

  @Column({ type: "int"})
  difference!: number;

  @Column({ type: "text", nullable: true })
  reason?: string;

  @Column({ type: "text", nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
