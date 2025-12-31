import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Book } from '../books/book.entity';

@Entity('tags')
export class Tag {
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Tag name' })
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @ApiProperty({ description: 'URL-friendly slug' })
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @ApiProperty({ description: 'Tag description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Hex color code for UI' })
  @Column({ type: 'varchar', length: 7, default: '#6366f1' })
  color: string;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ description: 'Books with this tag', type: () => [Book] })
  @ManyToMany(() => Book, (book) => book.tags)
  books: Book[];
}
