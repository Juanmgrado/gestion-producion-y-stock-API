import { IsString, MinLength, Validate } from "class-validator";
import { USER_PASSWORD_MIN_LENGTH } from "../../utills/consts.js";
import { MatchPasswordConstraint } from "../../validators/matchPassword.validator.js";

export class ChangePasswordDto {
  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH, {
    message: "Password must be at least 6 characters long",
  })
  currentPassword!: string;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH, {
    message: "Password must be at least 6 characters long",
  })
  newPassword!: string;

  @IsString()
  @MinLength(USER_PASSWORD_MIN_LENGTH)
  @Validate(MatchPasswordConstraint, ["newPassword"])
  repeatNewPassword!: string;
}
