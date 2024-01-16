import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import {  Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(private readonly authService: AuthService) {}

    validate(email: string, args: ValidationArguments) {
        return this.authService.emailExists(email).then(user => !user);
    }

}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
         registerDecorator({
             target: object.constructor,
             propertyName,
             options: validationOptions,
             constraints: [],
             validator: IsUserAlreadyExistConstraint,
         });
    };
 }
