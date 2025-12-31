import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUUID,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { BookType, BookStatus } from '../book.entity';

export class CreateBookDto {
  @ApiProperty({ description: 'Book title', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'URL-friendly slug', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiProperty({ description: 'Author name', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  author: string;

  @ApiPropertyOptional({ description: 'Book description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Cover image URL' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Book type', enum: BookType, default: BookType.MANGA })
  @IsOptional()
  @IsEnum(BookType)
  type?: BookType;

  @ApiPropertyOptional({ description: 'Publication status', enum: BookStatus, default: BookStatus.DRAFT })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;

  @ApiPropertyOptional({ description: 'Rating (0-5)', minimum: 0, maximum: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @ApiPropertyOptional({ description: 'Total number of chapters' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalChapters?: number;

  @ApiPropertyOptional({ description: 'Latest chapter number' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  latestChapter?: number;

  @ApiPropertyOptional({ description: 'Featured on homepage' })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ description: 'Tag IDs to associate', type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
