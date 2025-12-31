import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chapter } from "./chapter.entity";
import { ChapterPage } from "./chapter-page.entity";
import { Book } from "../books/book.entity";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { AddPagesDto } from "./dto/add-pages.dto";

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
    @InjectRepository(ChapterPage)
    private readonly pageRepository: Repository<ChapterPage>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}

  /**
   * Get all chapters for a book
   */
  async findAllByBook(bookId: string) {
    return this.chapterRepository.find({
      where: { bookId, isPublished: true },
      order: { chapterNumber: "ASC" },
      select: [
        "id",
        "chapterNumber",
        "title",
        "pageCount",
        "viewCount",
        "publishedAt",
      ],
    });
  }

  /**
   * Get a chapter with all pages
   */
  async findOne(id: string) {
    const chapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ["pages", "book"],
    });

    if (!chapter) {
      throw new NotFoundException(`Chapter with ID "${id}" not found`);
    }

    // Sort pages by page number
    if (chapter.pages) {
      chapter.pages.sort((a, b) => a.pageNumber - b.pageNumber);
    }

    return chapter;
  }

  /**
   * Get chapter by book and chapter number
   */
  async findByBookAndNumber(bookId: string, chapterNumber: number) {
    const chapter = await this.chapterRepository.findOne({
      where: { bookId, chapterNumber },
      relations: ["pages"],
    });

    if (!chapter) {
      throw new NotFoundException(
        `Chapter ${chapterNumber} not found for this book`
      );
    }

    // Sort pages by page number
    if (chapter.pages) {
      chapter.pages.sort((a, b) => a.pageNumber - b.pageNumber);
    }

    return chapter;
  }

  /**
   * Create a new chapter
   */
  async create(bookId: string, createChapterDto: CreateChapterDto) {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID "${bookId}" not found`);
    }

    // Check if chapter number already exists
    const existing = await this.chapterRepository.findOne({
      where: { bookId, chapterNumber: createChapterDto.chapterNumber },
    });
    if (existing) {
      throw new BadRequestException(
        `Chapter ${createChapterDto.chapterNumber} already exists`
      );
    }

    const chapter = this.chapterRepository.create({
      ...createChapterDto,
      bookId,
    });

    const saved = await this.chapterRepository.save(chapter);

    // Update book's latest chapter
    if (createChapterDto.chapterNumber > book.latestChapter) {
      await this.bookRepository.update(bookId, {
        latestChapter: createChapterDto.chapterNumber,
        totalChapters: book.totalChapters + 1,
      });
    }

    return saved;
  }

  /**
   * Update a chapter
   */
  async update(id: string, updateChapterDto: UpdateChapterDto) {
    const chapter = await this.findOne(id);
    Object.assign(chapter, updateChapterDto);
    return this.chapterRepository.save(chapter);
  }

  /**
   * Delete a chapter
   */
  async remove(id: string) {
    const chapter = await this.findOne(id);
    await this.chapterRepository.remove(chapter);
    return { deleted: true, id };
  }

  /**
   * Add pages to a chapter
   */
  async addPages(chapterId: string, addPagesDto: AddPagesDto) {
    const chapter = await this.findOne(chapterId);

    const pages = addPagesDto.pages.map((pageData) =>
      this.pageRepository.create({
        ...pageData,
        chapterId,
      })
    );

    await this.pageRepository.save(pages);

    // Update page count
    const totalPages = await this.pageRepository.count({
      where: { chapterId },
    });
    await this.chapterRepository.update(chapterId, { pageCount: totalPages });

    return this.findOne(chapterId);
  }

  /**
   * Remove a page
   */
  async removePage(pageId: string) {
    const page = await this.pageRepository.findOne({
      where: { id: pageId },
    });

    if (!page) {
      throw new NotFoundException(`Page with ID "${pageId}" not found`);
    }

    const chapterId = page.chapterId;
    await this.pageRepository.remove(page);

    // Update page count
    const totalPages = await this.pageRepository.count({
      where: { chapterId },
    });
    await this.chapterRepository.update(chapterId, { pageCount: totalPages });

    return { deleted: true, id: pageId };
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: string) {
    await this.chapterRepository.increment({ id }, "viewCount", 1);
    return this.findOne(id);
  }

  /**
   * Publish a chapter
   */
  async publish(id: string) {
    await this.chapterRepository.update(id, {
      isPublished: true,
      publishedAt: new Date(),
    });
    return this.findOne(id);
  }
}
