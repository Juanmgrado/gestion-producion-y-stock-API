import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  uuid!: string;

  @Column({ type: "varchar", length: 35 })
  name!: string;

  @Column({ type: "varchar", length: 30, unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;
}
