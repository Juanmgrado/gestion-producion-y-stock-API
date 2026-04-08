import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StockMovement } from "./stockMovement.entity.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 35 })
  name!: string;

  @Column({ type: "varchar", length: 30, unique: true })
  email!: string;

  @Column({ type: "int", unique: true })
  code!: number;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => StockMovement, (movement) => movement.employee) 
  movements: StockMovement[] | undefined;
}
