import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}
  async signup(signupData: SignupDto) {
    console.log('DD', signupData);
    const emailInUse = await this.UserModel.findOne({
      email: signupData.email,
    });

    if (emailInUse) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    await this.UserModel.create({
      name: signupData.name,
      email: signupData.email,
      password: hashedPassword,
    });
  }

  async login(creds: LoginDto) {
    console.log('FF', creds);
    const user = await this.UserModel.findOne({
      email: creds.email,
    });

    if (!user) throw new UnauthorizedException('Wrong Credentials');

    const passwordMatch = await bcrypt.compare(creds.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Wrong Credentials');

    return this.generateUserTokens(user._id);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    const x = await this.RefreshTokenModel.create({
      token,
      userId,
      expiryDate,
    });
    console.log('x:', x);
  }
}
