import {
  IsNotEmpty,
  ValidateNested,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PersonDto } from '@/email/dto/PersonDto';

export class SendEmailDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PersonDto)
  readonly to: PersonDto[];

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PersonDto)
  readonly cc: PersonDto[];

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PersonDto)
  readonly bcc: PersonDto[];

  @IsNotEmpty()
  @ValidateNested()
  readonly from: PersonDto;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  queue: boolean;
}
