import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "MatchPassword", async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const object = args.object as any;
    return object[relatedPropertyName] === value;
  }

  defaultMessage(args: ValidationArguments) {
    return "Passwords do not match";
  }
}
