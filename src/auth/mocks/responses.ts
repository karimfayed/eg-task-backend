import { Document } from 'mongoose';
import { User } from 'src/common/schemas/user.schema';

export const mockSignupResponse: {
  user: Document<unknown, NonNullable<unknown>, User> &
    User & { _id: unknown; __v: number };
} = {
  user: {
    _id: 'mocked-id',
    __v: 0,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
  } as any,
};

export const mockLoginResponse = {
  accessToken: 'mockAccessToken',
  refreshToken: 'mockRefreshToken',
};

export const mockRefreshResponse = mockLoginResponse;
