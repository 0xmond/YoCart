import { IsAlphanumeric, IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class ConfirmEmailDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}

export class ForgetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @IsString()
  @MinLength(8)
  @IsAlphanumeric()
  newPassword: string;
}
