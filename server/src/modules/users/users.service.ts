import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "./user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Seed default admin user on startup if it doesn't exist
   */
  async onModuleInit() {
    const adminEmail = "admin@bookstore.local";
    const existingAdmin = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      console.log(`🌱 Admin user not found. Seeding ${adminEmail}...`);
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = this.userRepository.create({
        email: adminEmail,
        username: "admin",
        password: hashedPassword,
        displayName: "System Admin",
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log(`✅ Default admin user created (${adminEmail} / admin123)`);
    } else {
      console.log(`✅ Admin user "${adminEmail}" already exists.`);
    }
  }

  async findAll() {
    return this.userRepository.find({
      select: [
        "id",
        "email",
        "username",
        "displayName",
        "role",
        "isActive",
        "avatarUrl",
        "createdAt",
        "lastLoginAt",
      ],
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto) {
    // Check if email exists
    const existingEmail = await this.findByEmail(createUserDto.email);
    if (existingEmail) {
      throw new ConflictException("Email already exists");
    }

    // Check if username exists
    const existingUsername = await this.findByUsername(createUserDto.username);
    if (existingUsername) {
      throw new ConflictException("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return { deleted: true, id };
  }

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async updateLastLogin(id: string) {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }
}
