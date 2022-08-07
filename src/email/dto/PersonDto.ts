import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class PersonDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  readonly email: string;

  @IsString()
  readonly name: string;
}
