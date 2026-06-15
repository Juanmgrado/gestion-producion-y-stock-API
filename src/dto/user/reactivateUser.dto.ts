import { IsEmail } from "class-validator";

export class ReactivateUserDto {
  @IsEmail()
  email!: string;
}
