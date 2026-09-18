import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsEmail()
  @MaxLength(160)
  email!: string;

  @IsOptional()
  @MaxLength(120)
  subject?: string;

  @IsNotEmpty()
  @MaxLength(4000)
  body!: string;
}
