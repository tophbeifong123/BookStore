import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from "class-validator";

export class PageDto {
  @ApiProperty({ description: "Page number", minimum: 1 })
  @IsInt()
  @Min(1)
  pageNumber: number;

  @ApiProperty({ description: "Image URL" })
  @IsString()
  @MaxLength(500)
  imageUrl: string;

  @ApiPropertyOptional({ description: "Image width in pixels" })
  @IsOptional()
  @IsInt()
  width?: number;

  @ApiPropertyOptional({ description: "Image height in pixels" })
  @IsOptional()
  @IsInt()
  height?: number;

  @ApiPropertyOptional({ description: "File size in bytes" })
  @IsOptional()
  @IsInt()
  fileSize?: number;
}

export class AddPagesDto {
  @ApiProperty({ description: "Array of pages to add", type: [PageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageDto)
  pages: PageDto[];
}
