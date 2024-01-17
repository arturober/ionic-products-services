import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { ImageService } from '../commons/image/image.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly imageService: ImageService,
        // tslint:disable-next-line:variable-name
        @Inject('JWT_KEY') private jwt_key: string,
        // tslint:disable-next-line:variable-name
        @Inject('JWT_EXPIRATION') private jwt_expiration: number,
    ) { }

    async getUser(id: number): Promise<User> {
        return this.userRepo.findOneOrFail({where: {id}});
    }

    private createToken(user: User) {
        const data: JwtPayload = {
            id: user.id,
        };
        const expiresIn = this.jwt_expiration;
        const accessToken = jwt.sign(data, this.jwt_key, { expiresIn });
        return {
            expiresIn,
            accessToken,
        };
    }

    async registerUser(userDto: RegisterUserDto) {
        userDto.avatar = await this.imageService.saveImage(userDto.avatar);
        await this.userRepo.insert(userDto);
        return userDto;
    }

    async login(userDto: LoginUserDto) {
        const user = await this.userRepo.findOneOrFail({where: {email: userDto.email, password: userDto.password}});
        if (userDto.firebaseToken) {
            user.firebaseToken = userDto.firebaseToken;
            await this.userRepo.save(user);
        }
        return this.createToken(user);
    }

    async emailExists(email: string): Promise<boolean> {
        return (await this.userRepo.findOne({where: {email}})) ? true : false;
    }

    async getProfile(id: number) {
        return await this.userRepo.findOneBy({id});
    }
}
