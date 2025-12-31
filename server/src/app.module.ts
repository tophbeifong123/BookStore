import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { BooksModule } from "./modules/books/books.module";
import { TagsModule } from "./modules/tags/tags.module";
import { ChaptersModule } from "./modules/chapters/chapters.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { HealthModule } from "./modules/health/health.module";

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),

    // Serve static files (uploaded images)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST", "localhost"),
        port: configService.get<number>("DATABASE_PORT", 5432),
        username: configService.get<string>("DATABASE_USER", "bookstore"),
        password: configService.get<string>(
          "DATABASE_PASSWORD",
          "bookstore_secret"
        ),
        database: configService.get<string>("DATABASE_NAME", "bookstore_db"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        synchronize: configService.get<string>("NODE_ENV") === "development",
        logging: configService.get<string>("NODE_ENV") === "development",
      }),
    }),

    // Feature modules
    BooksModule,
    TagsModule,
    ChaptersModule,
    UploadsModule,
    HealthModule,
  ],
})
export class AppModule {}
