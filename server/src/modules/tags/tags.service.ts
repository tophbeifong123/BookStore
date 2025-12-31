import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * Get all tags
   */
  async findAll() {
    return this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Get tags with book count
   */
  async findAllWithCount() {
    return this.tagRepository
      .createQueryBuilder('tag')
      .loadRelationCountAndMap('tag.bookCount', 'tag.books')
      .orderBy('tag.name', 'ASC')
      .getMany();
  }

  /**
   * Get a single tag by ID
   */
  async findOne(id: string) {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }

    return tag;
  }

  /**
   * Get a single tag by slug
   */
  async findBySlug(slug: string) {
    const tag = await this.tagRepository.findOne({
      where: { slug },
      relations: ['books'],
    });

    if (!tag) {
      throw new NotFoundException(`Tag with slug "${slug}" not found`);
    }

    return tag;
  }

  /**
   * Create a new tag
   */
  async create(createTagDto: CreateTagDto) {
    // Check for duplicate slug
    const existing = await this.tagRepository.findOne({
      where: [{ slug: createTagDto.slug }, { name: createTagDto.name }],
    });

    if (existing) {
      throw new ConflictException('Tag with this name or slug already exists');
    }

    const tag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(tag);
  }

  /**
   * Update an existing tag
   */
  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);

    // Check for duplicate if updating slug or name
    if (updateTagDto.slug || updateTagDto.name) {
      const existing = await this.tagRepository
        .createQueryBuilder('tag')
        .where('tag.id != :id', { id })
        .andWhere('(tag.slug = :slug OR tag.name = :name)', {
          slug: updateTagDto.slug || tag.slug,
          name: updateTagDto.name || tag.name,
        })
        .getOne();

      if (existing) {
        throw new ConflictException('Tag with this name or slug already exists');
      }
    }

    Object.assign(tag, updateTagDto);
    return this.tagRepository.save(tag);
  }

  /**
   * Delete a tag
   */
  async remove(id: string) {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
    return { deleted: true, id };
  }
}
