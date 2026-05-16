import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Length,
  Matches,
} from "class-validator";
import {
  MAX_USEREMAIL_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  USER_CODE_LENGTH,
} from "../../utills/conts.js";

export class CreateUserDto {
  @IsString()
  @MinLength(MIN_USERNAME_LENGTH)
  @MaxLength(MAX_USERNAME_LENGTH)
  name!: string;

  @IsEmail()
  @MaxLength(MAX_USEREMAIL_LENGTH)
  email!: string;

  @IsString()
  @Length(USER_CODE_LENGTH, USER_CODE_LENGTH)
  @Matches(/^\d{4}$/)
  code!: number;
}
