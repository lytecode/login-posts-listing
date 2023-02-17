import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { Auth } from './entities/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Auth)
        private authRepository: Repository<Auth>
    ) { }

    signup(authDto: AuthDto) {
        const newUser = this.authRepository.create(authDto);
        return this.authRepository.save(newUser);
    }

    login() { }

    logout() { }

    refreshToken() { }

}
