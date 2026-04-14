import {
  Check,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StockMovement } from "./stockMovement.entity.js";
import { StockAdjustment } from "./adjustmentStock.entity.js";
import { User } from "./user.entity.js";

@Entity("product")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    length: 255,
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

  @OneToMany(() => StockMovement, (movement) => movement.product)
  movements!: StockMovement[];

  @OneToMany(() => StockAdjustment, (adjustment) => adjustment.product)
  adjustments!: StockAdjustment[];

  @ManyToOne(() => User, (user) => user.products)
  user: User | undefined ;
}
