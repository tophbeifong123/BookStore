import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Book, BookStatus } from './book.entity';
import { Tag } from '../tags/tag.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * Get all books with pagination
   */
  async findAll(query: PaginationQueryDto) {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = query;

    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.tags', 'tag');

    // Search
    if (search) {
      queryBuilder.where(
        'book.title ILIKE :search OR book.author ILIKE :search',
        { search: `%${search}%` },
      );
    }

    // Only published books for public
    queryBuilder.andWhere('book.status = :status', { status: BookStatus.PUBLISHED });

    // Sorting
    queryBuilder.orderBy(`book.${sortBy}`, sortOrder as 'ASC' | 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get featured books
   */
  async findFeatured(limit = 5) {
    return this.bookRepository.find({
      where: { isFeatured: true, status: BookStatus.PUBLISHED },
      relations: ['tags'],
      order: { rating: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get a single book by ID
   */
  async findOne(id: string) {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    return book;
  }

  /**
   * Get a single book by slug
   */
  async findBySlug(slug: string) {
    const book = await this.bookRepository.findOne({
      where: { slug },
      relations: ['tags'],
    });

    if (!book) {
      throw new NotFoundException(`Book with slug "${slug}" not found`);
    }

    return book;
  }

  /**
   * Create a new book
   */
  async create(createBookDto: CreateBookDto) {
    const { tagIds, ...bookData } = createBookDto;

    const book = this.bookRepository.create(bookData);

    // Attach tags if provided
    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
      book.tags = tags;
    }

    return this.bookRepository.save(book);
  }

  /**
   * Update an existing book
   */
  async update(id: string, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id);
    const { tagIds, ...updateData } = updateBookDto;

    // Update tags if provided
    if (tagIds !== undefined) {
      const tags = tagIds.length > 0
        ? await this.tagRepository.find({ where: { id: In(tagIds) } })
        : [];
      book.tags = tags;
    }

    Object.assign(book, updateData);
    return this.bookRepository.save(book);
  }

  /**
   * Delete a book
   */
  async remove(id: string) {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
    return { deleted: true, id };
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string) {
    await this.bookRepository.increment({ id }, 'viewCount', 1);
    return this.findOne(id);
  }
}
