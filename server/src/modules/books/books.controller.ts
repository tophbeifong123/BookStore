import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { BooksService } from "./books.service";
import { Book } from "./book.entity";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "../auth/guards/optional-jwt-auth.guard";

@ApiTags("books")
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: "Get all books with pagination" })
  @ApiResponse({ status: 200, description: "Returns paginated list of books" })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.booksService.findAll(query);
  }

  @Get("my-books")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user's books" })
  @ApiResponse({ status: 200, description: "Returns user's books" })
  async findMyBooks(
    @Request() req: { user: { id: string } },
    @Query() query: PaginationQueryDto
  ) {
    return this.booksService.findByUser(req.user.id, query);
  }

  @Get("featured")
  @ApiOperation({ summary: "Get featured books" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: "Returns featured books",
    type: [Book],
  })
  async findFeatured(@Query("limit") limit?: number) {
    return this.booksService.findFeatured(limit);
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a book by slug" })
  @ApiParam({ name: "slug", description: "Book slug" })
  @ApiResponse({ status: 200, description: "Returns the book", type: Book })
  @ApiResponse({ status: 404, description: "Book not found" })
  async findBySlug(@Param("slug") slug: string) {
    return this.booksService.findBySlug(slug);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a book by ID" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @ApiResponse({ status: 200, description: "Returns the book", type: Book })
  @ApiResponse({ status: 404, description: "Book not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.booksService.findOne(id);
  }

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new book" })
  @ApiResponse({ status: 201, description: "Book created", type: Book })
  @ApiResponse({ status: 400, description: "Validation error" })
  async create(
    @Request() req: { user?: { id: string } },
    @Body() createBookDto: CreateBookDto
  ) {
    const userId = req.user?.id;
    return this.booksService.create(createBookDto, userId);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a book" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @ApiResponse({ status: 200, description: "Book updated", type: Book })
  @ApiResponse({ status: 404, description: "Book not found" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto
  ) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a book" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @ApiResponse({ status: 200, description: "Book deleted" })
  @ApiResponse({ status: 404, description: "Book not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.booksService.remove(id);
  }

  @Post(":id/view")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Increment book view count" })
  @ApiParam({ name: "id", description: "Book UUID" })
  @ApiResponse({
    status: 200,
    description: "View count incremented",
    type: Book,
  })
  async incrementView(@Param("id", ParseUUIDPipe) id: string) {
    return this.booksService.incrementViewCount(id);
  }
}
