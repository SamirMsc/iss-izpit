import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly newPassword: string;

  @IsNotEmpty()
  @IsString()
  readonly repeatNewPassword: string;
}
