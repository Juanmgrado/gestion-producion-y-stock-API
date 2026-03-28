import { Check, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    nullable: false,
    unique: true,
  })
  @Check(`"stock" >= 0`)
  name!: string;

  @Column({ type: "int", default: 0 })
  stock!: number;

  @Column({type: "boolean", default: true})
  isActive!: boolean;
  movements: any;
}
