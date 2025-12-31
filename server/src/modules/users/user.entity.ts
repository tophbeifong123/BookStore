import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @ApiProperty({ description: "Unique identifier" })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({ description: "Email address" })
  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @ApiProperty({ description: "Username" })
  @Column({ type: "varchar", length: 100, unique: true })
  username: string;

  @Exclude()
  @Column({ type: "varchar", length: 255 })
  password: string;

  @ApiProperty({ description: "Display name" })
  @Column({
    type: "varchar",
    length: 255,
    nullable: true,
    name: "display_name",
  })
  displayName: string;

  @ApiProperty({ description: "User role", enum: UserRole })
  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: "Is account active" })
  @Column({ type: "boolean", default: true, name: "is_active" })
  isActive: boolean;

  @ApiProperty({ description: "Profile image URL" })
  @Column({ type: "varchar", length: 500, nullable: true, name: "avatar_url" })
  avatarUrl: string;

  @ApiProperty({ description: "Creation timestamp" })
  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @ApiProperty({ description: "Last update timestamp" })
  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @ApiProperty({ description: "Last login timestamp" })
  @Column({ type: "timestamptz", nullable: true, name: "last_login_at" })
  lastLoginAt: Date;
}
