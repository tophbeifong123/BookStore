import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { ChaptersService } from "./chapters.service";
import { Chapter } from "./chapter.entity";
import { CreateChapterDto } from "./dto/create-chapter.dto";
import { UpdateChapterDto } from "./dto/update-chapter.dto";
import { AddPagesDto } from "./dto/add-pages.dto";

@ApiTags("chapters")
@Controller("books/:bookId/chapters")
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Get()
  @ApiOperation({ summary: "Get all chapters for a book" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiResponse({
    status: 200,
    description: "Returns all chapters",
    type: [Chapter],
  })
  async findAll(@Param("bookId", ParseUUIDPipe) bookId: string) {
    return this.chaptersService.findAllByBook(bookId);
  }

  @Get(":chapterNumber")
  @ApiOperation({ summary: "Get a chapter by number with all pages" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "chapterNumber", description: "Chapter number" })
  @ApiResponse({
    status: 200,
    description: "Returns the chapter with pages",
    type: Chapter,
  })
  async findByNumber(
    @Param("bookId", ParseUUIDPipe) bookId: string,
    @Param("chapterNumber", ParseIntPipe) chapterNumber: number
  ) {
    return this.chaptersService.findByBookAndNumber(bookId, chapterNumber);
  }

  @Post()
  @ApiOperation({ summary: "Create a new chapter" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiResponse({ status: 201, description: "Chapter created", type: Chapter })
  async create(
    @Param("bookId", ParseUUIDPipe) bookId: string,
    @Body() createChapterDto: CreateChapterDto
  ) {
    return this.chaptersService.create(bookId, createChapterDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a chapter" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "id", description: "Chapter UUID" })
  @ApiResponse({ status: 200, description: "Chapter updated", type: Chapter })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateChapterDto: UpdateChapterDto
  ) {
    return this.chaptersService.update(id, updateChapterDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a chapter" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "id", description: "Chapter UUID" })
  @ApiResponse({ status: 200, description: "Chapter deleted" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.chaptersService.remove(id);
  }

  @Post(":id/pages")
  @ApiOperation({ summary: "Add pages to a chapter" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "id", description: "Chapter UUID" })
  @ApiResponse({ status: 201, description: "Pages added", type: Chapter })
  async addPages(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() addPagesDto: AddPagesDto
  ) {
    return this.chaptersService.addPages(id, addPagesDto);
  }

  @Delete("pages/:pageId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Remove a page" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "pageId", description: "Page UUID" })
  @ApiResponse({ status: 200, description: "Page deleted" })
  async removePage(@Param("pageId", ParseUUIDPipe) pageId: string) {
    return this.chaptersService.removePage(pageId);
  }

  @Post(":id/view")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Increment chapter view count" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "id", description: "Chapter UUID" })
  @ApiResponse({
    status: 200,
    description: "View count incremented",
    type: Chapter,
  })
  async incrementView(@Param("id", ParseUUIDPipe) id: string) {
    return this.chaptersService.incrementViewCount(id);
  }

  @Post(":id/publish")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Publish a chapter" })
  @ApiParam({ name: "bookId", description: "Book UUID" })
  @ApiParam({ name: "id", description: "Chapter UUID" })
  @ApiResponse({ status: 200, description: "Chapter published", type: Chapter })
  async publish(@Param("id", ParseUUIDPipe) id: string) {
    return this.chaptersService.publish(id);
  }
}
