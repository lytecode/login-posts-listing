import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types/tokens';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/signup')
  signup(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.signup(authDto);
  }

  @Post('/login')
  login(@Body() authDto: AuthDto): Promise<Tokens> {
    return this.authService.login(authDto);
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refreshToken() {
    return this.authService.refreshToken();
  }
}
