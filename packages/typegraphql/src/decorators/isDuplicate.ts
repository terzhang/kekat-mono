import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import { User } from '../entity/User';

@ValidatorConstraint({ async: true })
export class isDuplicateConstraint implements ValidatorConstraintInterface {
  validate(_value: string, args: ValidationArguments) {
    /* ValidationArguments {
      property: string - the field name
      value: any - the field value,
      targetName: string - what object/class is being validated,
      object: object - the target's object; contains every given propName and propValue
    } */
    return User.findOne({
      where: { [args.property]: args.value },
    }).then((user) => {
      // if a user can be found with the given info, the info is duplicate (already exist)
      if (user) return false;
      return true;
    });
  }
}

// define a custom decorator that valid its decorated field value..
// to check if such field value of the corresponding field name already exist within the User entity
export function isDuplicate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: isDuplicateConstraint,
    });
  };
}
