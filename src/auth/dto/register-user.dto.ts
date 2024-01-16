import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as crypto from 'crypto';
import { IsUserAlreadyExist } from '../validators/user-exists.validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsUserAlreadyExist({
    message: 'Email $value is already present in the database',
  })
  readonly email: string;

  @IsString()
  @Transform((p) =>
    p.value && typeof p.value === 'string'
      ? crypto.createHash('sha256').update(p.value, 'utf-8').digest('base64')
      : p.value,
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;
}
