import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { TagsService } from "./tags.service";
import { Tag } from "./tag.entity";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";

@ApiTags("tags")
@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: "Get all tags" })
  @ApiResponse({ status: 200, description: "Returns all tags", type: [Tag] })
  async findAll() {
    return this.tagsService.findAllWithCount();
  }

  @Get("slug/:slug")
  @ApiOperation({ summary: "Get a tag by slug with its books" })
  @ApiParam({ name: "slug", description: "Tag slug" })
  @ApiResponse({
    status: 200,
    description: "Returns the tag with books",
    type: Tag,
  })
  @ApiResponse({ status: 404, description: "Tag not found" })
  async findBySlug(@Param("slug") slug: string) {
    return this.tagsService.findBySlug(slug);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a tag by ID" })
  @ApiParam({ name: "id", description: "Tag UUID" })
  @ApiResponse({ status: 200, description: "Returns the tag", type: Tag })
  @ApiResponse({ status: 404, description: "Tag not found" })
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: "Create a new tag" })
  @ApiResponse({ status: 201, description: "Tag created", type: Tag })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 409, description: "Tag already exists" })
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a tag" })
  @ApiParam({ name: "id", description: "Tag UUID" })
  @ApiResponse({ status: 200, description: "Tag updated", type: Tag })
  @ApiResponse({ status: 404, description: "Tag not found" })
  @ApiResponse({ status: 409, description: "Tag already exists" })
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTagDto: UpdateTagDto
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete a tag" })
  @ApiParam({ name: "id", description: "Tag UUID" })
  @ApiResponse({ status: 200, description: "Tag deleted" })
  @ApiResponse({ status: 404, description: "Tag not found" })
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.tagsService.remove(id);
  }
}
