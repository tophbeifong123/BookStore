import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  ParseUUIDPipe,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from "@nestjs/swagger";
import { UploadsService } from "./uploads.service";

@ApiTags("uploads")
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post("cover")
  @UseInterceptors(FileInterceptor("cover"))
  @ApiOperation({ summary: "Upload a book cover image" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        cover: {
          type: "string",
          format: "binary",
          description: "Cover image file (JPEG, PNG, GIF, WebP)",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Cover uploaded successfully" })
  @ApiResponse({ status: 400, description: "Invalid file" })
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Cover file is required");
    }
    return this.uploadsService.processCoverUpload(file);
  }

  @Post("chapters/:chapterId/pages")
  @UseInterceptors(FilesInterceptor("pages", 100)) // Max 100 pages per upload
  @ApiOperation({ summary: "Upload chapter pages (multiple images)" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({ name: "chapterId", description: "Chapter UUID" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        pages: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
          description: "Page image files (JPEG, PNG, GIF, WebP)",
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: "Pages uploaded successfully" })
  @ApiResponse({ status: 400, description: "Invalid files" })
  uploadChapterPages(
    @Param("chapterId") chapterId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException("At least one page file is required");
    }

    const uploadedFiles = this.uploadsService.processChapterPagesUpload(files);

    // Return with page numbers based on upload order
    return {
      chapterId,
      totalPages: files.length,
      pages: uploadedFiles.map((file, index) => ({
        pageNumber: index + 1,
        ...file,
      })),
    };
  }

  @Delete("file")
  @ApiOperation({ summary: "Delete an uploaded file by URL" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "Full URL of the file to delete",
        },
        type: {
          type: "string",
          enum: ["cover", "page"],
          description: "Type of file",
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: "File deleted" })
  deleteFile(@Param("url") url: string, @Param("type") type: "cover" | "page") {
    let deleted = false;

    if (type === "cover") {
      deleted = this.uploadsService.deleteCover(url);
    } else {
      deleted = this.uploadsService.deleteChapterPage(url);
    }

    return { deleted, url };
  }
}
