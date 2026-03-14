import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string; 

  @Column({ type: "varchar", length: 30 })
  name!: string;

  @Column({ type: "varchar", length: 30, unique: true })
  email!: string;

  @Column({ type: "int", unique: true }) 
  code!: number;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

}
