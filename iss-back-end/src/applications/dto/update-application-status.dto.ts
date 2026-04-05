import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicationStatusDto {
  @IsIn(['ACCEPTED', 'REJECTED'])
  status: 'ACCEPTED' | 'REJECTED';

  @IsString()
  @IsNotEmpty()
  companyResponse: string;
}
