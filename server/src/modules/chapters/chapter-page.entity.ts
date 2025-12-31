import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Chapter } from "./chapter.entity";

@Entity("chapter_pages")
export class ChapterPage {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Page number in chapter" })
  @Column({ type: "int", name: "page_number" })
  pageNumber: number;

  @ApiProperty({ description: "Image URL" })
  @Column({ type: "varchar", length: 500, name: "image_url" })
  imageUrl: string;

  @ApiProperty({ description: "Image width in pixels", required: false })
  @Column({ type: "int", nullable: true })
  width: number;

  @ApiProperty({ description: "Image height in pixels", required: false })
  @Column({ type: "int", nullable: true })
  height: number;

  @ApiProperty({ description: "File size in bytes", required: false })
  @Column({ type: "int", nullable: true, name: "file_size" })
  fileSize: number;

  @ApiProperty({ description: "Creation timestamp" })
  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  // Relations
  @ApiProperty({ description: "Chapter ID" })
  @Column({ type: "uuid", name: "chapter_id" })
  chapterId: string;

  @ManyToOne(() => Chapter, (chapter) => chapter.pages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chapter_id" })
  chapter: Chapter;
}
