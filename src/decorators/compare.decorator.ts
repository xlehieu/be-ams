import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function Compare(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'compare',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // args
//           {
//   targetName: 'RegisterDto',
//   property: 'confirm_password',
//   object: RegisterDto {
//     email: 'user@example.com',
//     password: '123456',
//     confirm_password: '1234567',
//     name: 'Hieu',
//     department_id: 1,
//     employee_code: 'NV-001',
//     role: 'ADMIN'
//   },
//   value: '1234567',
//   constraints: [ 'password' ]
// }
          const [relatedProperty] = args.constraints;
          return value === (args.object as any)[relatedProperty];
        },
      },
    });
  };
}