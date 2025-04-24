import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.schema';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/common/schemas/user.schema';
import { ErrorMessages } from 'src/common/enums/error-messages.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}
  async signUp(signupData: SignupDto) {
    const isEmailExists = await this.UserModel.findOne({
      email: signupData.email,
    });

    if (isEmailExists)
      throw new BadRequestException(ErrorMessages.EMAIL_EXISTS);

    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    const createdUser = await this.UserModel.create({
      name: signupData.name,
      email: signupData.email,
      password: hashedPassword,
    });
    return createdUser;
  }

  async login(creds: LoginDto) {
    const user = await this.UserModel.findOne({
      email: creds.email,
    });

    if (!user) throw new UnauthorizedException(ErrorMessages.INVALID_CREDS);

    const isPasswordValid = await bcrypt.compare(creds.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException(ErrorMessages.INVALID_CREDS);

    return this.generateUserTokens(user._id);
  }

  async refreshToken(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOneAndDelete({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token)
      throw new UnauthorizedException(ErrorMessages.INVALID_REFRESH_TOKEN);

    return await this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: 30 });
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

    await this.RefreshTokenModel.updateOne(
      {
        userId,
      },
      { $set: { expiryDate, token } },
      {
        upsert: true,
      },
    );
  }
}
