import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user.service';

export interface ISimpleUser {
  _id: number;
  username: string;
  role: number;
}

/**
 * Стратегия получения доступа по JWT-токену
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret_word',
      passReqToCallback: true,
    });
  }

  /**
   * Валидирует пользователя по ID из токена
   * @async
   * @param {Request} req запрос
   * @param payload данные
   * @returns {Promise<ISimpleUser>} пользователь
   */
  async validate(req: Request, payload: any): Promise<ISimpleUser> {
    const _id = payload.sub;
    const user = await this.userService.findOne(_id);
    if (!user) {
      throw new UnauthorizedException(
        'Token invalid, user from token not found',
      );
    }

    return { _id, username: user.username, role: user.role };
  }
}
