import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { loginData, refreshData, signupData } from './test-data/input';
import {
  mockLoginResponse,
  mockRefreshResponse,
  mockSignupResponse,
} from './mocks/responses';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('Signup', () => {
    it('should call authService.signUp with correct params and returns correct value', async () => {
      const signupSpy = jest.spyOn(authService, 'signup');
      signupSpy.mockResolvedValue(mockSignupResponse);

      const result = await authController.signUp(signupData);

      expect(authService.signup).toHaveBeenCalledWith(signupData);
      expect(result).toEqual(mockSignupResponse);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct params and returns correct value', async () => {
      const loginSpy = jest.spyOn(authService, 'login');
      loginSpy.mockResolvedValue(mockLoginResponse);

      const result = await authController.login(loginData);

      expect(loginSpy).toHaveBeenCalledWith(loginData);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('refresh', () => {
    it('should call authService.refreshToken with correct params and returns correct value', async () => {
      const refreshTokenSpy = jest.spyOn(authService, 'refreshToken');
      refreshTokenSpy.mockResolvedValue(mockRefreshResponse);

      const result = await authController.refresh(refreshData);

      expect(refreshTokenSpy).toHaveBeenCalledWith(refreshData.refreshToken);
      expect(result).toEqual(mockRefreshResponse);
    });
  });
});
