import { IsEmail, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsString()
  email!: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
  })
  @IsString()
  password!: string;

  @ApiPropertyOptional({
    description: 'Device identifier',
    example: 'iPhone 14 Pro',
  })
  @IsOptional()
  @IsString()
  device?: string;
}
