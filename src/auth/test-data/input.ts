import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SignupDto } from '../dtos/signup.dto';

export const signupData: SignupDto = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword123',
};

export const loginData: LoginDto = {
  email: 'john@example.com',
  password: 'securepassword123',
};

export const refreshData: RefreshTokenDto = {
  refreshToken: 'mockRefreshToken',
};
