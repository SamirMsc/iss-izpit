import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  repeatPassword: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsIn(['STUDENT', 'COMPANY'])
  role: 'STUDENT' | 'COMPANY';
}
