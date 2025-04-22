import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ConfirmEmailDto,
  ForgetPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from './dto';
import { AuthService } from './auth.service';
import { messages } from 'src/common/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // signup
  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.authService.signup(signupDto);
    return {
      success: true,
      message: 'User created successfully',
      data: user,
    };
  }

  // login
  @Post('/login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    const accessToken = await this.authService.login(loginDto);

    return {
      success: true,
      message: 'Logged in successfully',
      accessToken,
    };
  }

  // login
  @Post('/confirm')
  @HttpCode(200)
  async confirmEmail(@Body() confirmEmailDto: ConfirmEmailDto) {
    const message = await this.authService.confirmEmail(confirmEmailDto);
    return {
      success: true,
      message,
    };
  }

  // forget password
  @Post('forget-password')
  @HttpCode(200)
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    await this.authService.forgetPassword(forgetPasswordDto);
    return {
      success: true,
      message: messages.email.isSent,
    };
  }

  // reset password
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return {
      success: true,
      message: messages.user.updatedSuccessfully,
    };
  }
}
