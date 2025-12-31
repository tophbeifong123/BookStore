import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

/**
 * Optional JWT Guard - authenticates if token present, allows if not
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    // Don't throw error if no user/token, just return the user OR null
    return user || null;
  }
}
