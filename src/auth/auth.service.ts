import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}
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
}
