import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { UserService } from '../user.service';

/**
 * Стратегия получения доступа по логину/паролю
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super();
  }

  async validate(username: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.validateUser(username, password);
    if (!user || !username || !password) {
      throw new UnauthorizedException('Username or password are incorrect');
    }

    return user;
  }
}
