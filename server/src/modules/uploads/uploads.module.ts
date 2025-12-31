import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { v4 as uuidv4 } from "uuid";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: (req, file, cb) => {
            // Determine upload folder based on field name
            let uploadPath = "./uploads";

            if (file.fieldname === "cover") {
              uploadPath = "./uploads/covers";
            } else if (file.fieldname === "pages") {
              uploadPath = "./uploads/chapters";
            }

            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            // Generate unique filename
            const uniqueSuffix = uuidv4();
            const ext = extname(file.originalname);
            cb(null, `${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          // Only allow images
          if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
            cb(new Error("Only image files are allowed!"), false);
          }
          cb(null, true);
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB max
        },
      }),
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule {}
