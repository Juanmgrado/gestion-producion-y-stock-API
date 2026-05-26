import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Validate,
  IsBoolean,
} from "class-validator";
import {
  MAX_USEREMAIL_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from "../../utills/conts.js";
import { MatchPasswordConstraint } from "../../validators/matchPassword.validator.js";

export class CreateUserDto {
  @IsString()
  @MinLength(MIN_USERNAME_LENGTH)
  @MaxLength(MAX_USERNAME_LENGTH)
  name!: string;

  @IsEmail()
  @MaxLength(MAX_USEREMAIL_LENGTH)
  email!: string;

  @IsBoolean()
  isAdmin!: boolean;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH, { message: "Password must have unless 6 caracters"})
  password!: string;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH)
  @Validate(MatchPasswordConstraint)
  repeatPassword!: string;
}
