import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChaptersController } from "./chapters.controller";
import { ChaptersService } from "./chapters.service";
import { Chapter } from "./chapter.entity";
import { ChapterPage } from "./chapter-page.entity";
import { Book } from "../books/book.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Chapter, ChapterPage, Book])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
