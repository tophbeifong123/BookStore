import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

@Injectable()
export class UploadsService {
  private readonly baseUrl: string;
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>(
      "BASE_URL",
      "http://localhost:8000"
    );
    this.uploadDir = "./uploads";

    // Ensure upload directories exist
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      this.uploadDir,
      join(this.uploadDir, "covers"),
      join(this.uploadDir, "chapters"),
    ];

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Process uploaded cover image
   */
  processCoverUpload(file: Express.Multer.File): UploadedFile {
    return {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${this.baseUrl}/uploads/covers/${file.filename}`,
    };
  }

  /**
   * Process uploaded chapter pages (multiple files)
   */
  processChapterPagesUpload(files: Express.Multer.File[]): UploadedFile[] {
    return files.map((file, index) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `${this.baseUrl}/uploads/chapters/${file.filename}`,
    }));
  }

  /**
   * Delete a file
   */
  deleteFile(filePath: string): boolean {
    try {
      const fullPath = join(this.uploadDir, filePath);
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Delete cover image by URL
   */
  deleteCover(url: string): boolean {
    const filename = url.split("/").pop();
    if (!filename) return false;
    return this.deleteFile(join("covers", filename));
  }

  /**
   * Delete chapter page by URL
   */
  deleteChapterPage(url: string): boolean {
    const filename = url.split("/").pop();
    if (!filename) return false;
    return this.deleteFile(join("chapters", filename));
  }
}
