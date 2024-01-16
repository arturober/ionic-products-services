import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';
import * as crypto from 'crypto';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  @Transform((p) =>
    p.value && typeof p.value === 'string'
      ? crypto.createHash('sha256').update(p.value, 'utf-8').digest('base64')
      : p.value,
  )
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly firebaseToken: string;
}
