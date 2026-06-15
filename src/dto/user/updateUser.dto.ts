import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  email!: string;

  @IsEmail()
  @IsOptional()
  newEmail?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;
}
