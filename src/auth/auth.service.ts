import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>,
        private jwtService: JwtService
    ) { }

    async signup(authDto: AuthDto) {
        const user = await this.authRepository.findOneBy({ email: authDto.email });
        if (user) {
            throw new BadRequestException(`User with ${authDto.email} already exist, please login`);
        }
        const hashedPassword = await hashPassword(authDto.password);
        const newUser = await this.authRepository.save({
            email: authDto.email,
            password: hashedPassword
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);

        await this.updateHashRefreshToken(newUser.id, tokens.refresh_token)

        return tokens;
    }

    login() { }

    logout() { }

    refreshToken() { }

    async updateHashRefreshToken(userId: string, refreshToken: string) {
        const hashRefreshToken = await hashPassword(refreshToken);
        await this.authRepository.update({ id: userId }, { hashRt: hashRefreshToken })
    }

    async getTokens(userId: string, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: 'at-token-secret',
                expiresIn: 60 * 15
            }),
            this.jwtService.signAsync({
                sub: userId,
                email
            }, {
                secret: 'rt-token-secret',
                expiresIn: 60 * 60 * 24 * 7
            })
        ])

        return {
            access_token: at,
            refresh_token: rt
        }
    }
}
