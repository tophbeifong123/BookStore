import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Book } from "../books/book.entity";
import { ChapterPage } from "./chapter-page.entity";

@Entity("chapters")
export class Chapter {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Chapter number" })
  @Column({ type: "int", name: "chapter_number" })
  chapterNumber: number;

  @ApiProperty({ description: "Chapter title", required: false })
  @Column({ type: "varchar", length: 255, nullable: true })
  title: string;

  @ApiProperty({ description: "Total pages in this chapter" })
  @Column({ type: "int", default: 0, name: "page_count" })
  pageCount: number;

  @ApiProperty({ description: "View count for this chapter" })
  @Column({ type: "int", default: 0, name: "view_count" })
  viewCount: number;

  @ApiProperty({ description: "Is chapter published" })
  @Column({ type: "boolean", default: false, name: "is_published" })
  isPublished: boolean;

  @ApiProperty({ description: "Publication date" })
  @Column({ type: "timestamptz", nullable: true, name: "published_at" })
  publishedAt: Date;

  @ApiProperty({ description: "Creation timestamp" })
  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @ApiProperty({ description: "Last update timestamp" })
  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: "Book ID" })
  @Column({ type: "uuid", name: "book_id" })
  bookId: string;

  @ManyToOne(() => Book, (book) => book.chapters, { onDelete: "CASCADE" })
  @JoinColumn({ name: "book_id" })
  book: Book;

  // Pages (not exposed in Swagger to avoid circular dependency)
  @OneToMany(() => ChapterPage, (page) => page.chapter, { cascade: true })
  pages: ChapterPage[];
}
