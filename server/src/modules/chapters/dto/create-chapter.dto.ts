import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsInt, IsBoolean, Min } from "class-validator";

export class CreateChapterDto {
  @ApiProperty({ description: "Chapter number", minimum: 1 })
  @IsInt()
  @Min(1)
  chapterNumber: number;

  @ApiPropertyOptional({ description: "Chapter title" })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: "Publish immediately", default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
