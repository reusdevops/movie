import { IsBoolean, IsNotEmpty, IsString, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Action',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique URL-friendly slug for the category',
    example: 'action',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Action-packed movies and shows',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Whether the category is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @ApiPropertyOptional({
    description: 'URL to the category thumbnail image',
    example: 'https://example.com/action-thumbnail.jpg',
    default: '',
  })
  @IsString()
  @IsOptional()
  thumbnail_url?: string;
}
