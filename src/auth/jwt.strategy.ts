import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject('JWT_KEY') jwt_key: string) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt_key,
    });
  }

  // tslint:disable-next-line:ban-types
  async validate(payload: JwtPayload, done: Function) {
    try {
      const user = await this.authService.getUser(payload.id);
      done(null, user);
    } catch {
      return done(new UnauthorizedException(), false);
    }
  }
}