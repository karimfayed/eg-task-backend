import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signupData: SignupDto) {
    console.log('SSS');
    return this.authService.signup(signupData);
  }

  @Post('login')
  async login(@Body() creds: LoginDto) {
    console.log('SSS');
    return this.authService.login(creds);
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    console.log('AAA');
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
