import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class PersonDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
