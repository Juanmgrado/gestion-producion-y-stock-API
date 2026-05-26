import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "MatchPassword", async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(repeatPassword: string, args: ValidationArguments) {
    const object = args.object as any;

    return object.password === repeatPassword;
  }

  defaultMessage() {
    return "Passwords do not match";
  }
}
