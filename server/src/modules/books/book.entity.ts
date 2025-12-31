import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
  JoinColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "../tags/tag.entity";
import { Chapter } from "../chapters/chapter.entity";

export enum BookType {
  MANGA = "manga",
  NOVEL = "novel",
  MANHWA = "manhwa",
  MANHUA = "manhua",
  COMIC = "comic",
}

export enum BookStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Entity("books")
export class Book {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Book title" })
  @Column({ type: "varchar", length: 255 })
  title: string;

  @ApiProperty({ description: "URL-friendly slug" })
  @Column({ type: "varchar", length: 255, unique: true })
  slug: string;

  @ApiProperty({ description: "Author name" })
  @Column({ type: "varchar", length: 255 })
  author: string;

  @ApiProperty({ description: "Book description", required: false })
  @Column({ type: "text", nullable: true })
  description: string;

  @ApiProperty({ description: "Cover image URL", required: false })
  @Column({ type: "varchar", length: 500, nullable: true, name: "cover_image" })
  coverImage: string;

  @ApiProperty({ description: "Book type", enum: BookType })
  @Column({ type: "enum", enum: BookType, default: BookType.MANGA })
  type: BookType;

  @ApiProperty({ description: "Publication status", enum: BookStatus })
  @Column({ type: "enum", enum: BookStatus, default: BookStatus.DRAFT })
  status: BookStatus;

  @ApiProperty({ description: "Average rating (0-5)" })
  @Column({ type: "decimal", precision: 2, scale: 1, default: 0 })
  rating: number;

  @ApiProperty({ description: "Total number of chapters" })
  @Column({ type: "int", default: 0, name: "total_chapters" })
  totalChapters: number;

  @ApiProperty({ description: "Latest chapter number" })
  @Column({ type: "int", default: 0, name: "latest_chapter" })
  latestChapter: number;

  @ApiProperty({ description: "Total view count" })
  @Column({ type: "int", default: 0, name: "view_count" })
  viewCount: number;

  @ApiProperty({ description: "Featured on homepage" })
  @Column({ type: "boolean", default: false, name: "is_featured" })
  isFeatured: boolean;

  @ApiProperty({ description: "Publication date", required: false })
  @Column({ type: "timestamptz", nullable: true, name: "published_at" })
  publishedAt: Date;

  @ApiProperty({ description: "Creation timestamp" })
  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @ApiProperty({ description: "Last update timestamp" })
  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  // Relations
  @ApiProperty({ description: "Associated tags", type: () => [Tag] })
  @ManyToMany(() => Tag, (tag) => tag.books, { cascade: true })
  @JoinTable({
    name: "book_tags",
    joinColumn: { name: "book_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "tag_id", referencedColumnName: "id" },
  })
  tags: Tag[];

  // Chapters (not exposed in Swagger to avoid circular dependency)
  @OneToMany(() => Chapter, (chapter) => chapter.book)
  chapters: Chapter[];
}
