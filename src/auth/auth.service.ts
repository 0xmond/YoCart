import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConfirmEmailDto,
  ForgetPasswordDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
} from './dto';
import { UserRepo } from 'src/db/models/user/user.repo';
import { compare, hash } from 'src/common/security/hash';
import { sendEmail } from 'src/common/utils/email.utils';
import { JwtService } from '@nestjs/jwt';
import { generateOTP } from 'src/common/utils/otp.utils';
import { EMAIL_SUBJECTS, messages, OTP_TYPE } from 'src/common/enums';
import { TUser } from 'src/db/models/user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const user = await this.userRepo.findByEmail(signupDto.email);
    if (user) throw new ConflictException('This email already exists');

    const otp = generateOTP();

    const createdUser = await this.userRepo.create({
      email: signupDto.email,
      name: signupDto.name,
      password: hash(signupDto.password),
      otp: [
        {
          code: hash(otp),
          otpType: OTP_TYPE.SEND_EMAIL,
          expiresIn: new Date(Date.now() + 60 * 60 * 1000),
        },
      ],
    });

    await sendEmail({
      to: signupDto.email,
      subject: EMAIL_SUBJECTS.EMAIL_CONFIRMATION,
      html: `<h1>Thanks for trusting us</h1><br><p>Your OTP: ${otp}</p>`,
    });

    return createdUser;
  }

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.userRepo.findOne({
      filter: { email: loginDto.email },
    });

    if (!user || !compare(loginDto.password, user.password))
      throw new UnauthorizedException('Email or password is incorrect');

    if (!user.isConfirmed)
      throw new UnauthorizedException('Confirm your email first');

    const accessToken = this.jwtService.sign(
      { _id: user._id, email: user.email },
      { expiresIn: '1y', privateKey: process.env.JWT_SECRET },
    );

    return accessToken;
  }

  async confirmEmail(confirmEmailDto: ConfirmEmailDto) {
    const { otp, email } = confirmEmailDto;

    const user = await this.userRepo.findOne({ filter: { email } });

    if (!user) throw new NotFoundException(messages.user.notFound);

    const isValidOTP = this.confirmOtp(user, otp, OTP_TYPE.SEND_EMAIL);
    if (!isValidOTP) throw new BadRequestException('Invalid OTP');

    await user.updateOne({
      isConfirmed: true,
      $pull: {
        otp: { code: user.otp.map((o) => compare(otp, o.code)) },
      },
    });

    return messages.user.emailConfirmed;
  }

  private confirmOtp(user: TUser, otp: string, otpType: string) {
    if (
      !user.otp.some(
        (o) =>
          compare(otp, o.code) &&
          new Date(o.expiresIn) > new Date() &&
          o.otpType == otpType,
      )
    ) {
      return false;
    }
    return true;
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;

    const user = this.userRepo.findByEmail(email);

    if (!user) throw new NotFoundException(messages.user.notFound);

    const otp = generateOTP();

    await sendEmail({
      to: email,
      subject: EMAIL_SUBJECTS.RESET_PASSWORD,
      html: `<h1>Thanks for trusting us</h1><br><p>Your OTP: ${otp}</p>`,
    });

    await user.updateOne({
      $push: {
        otp: {
          code: otp,
          otpType: OTP_TYPE.FORGET_PASSWORD,
          expiresIn: new Date(Date.now() + 60 * 60 * 1000),
        },
      },
    });

    return;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, otp, newPassword } = resetPasswordDto;

    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new NotFoundException(messages.user.notFound);

    const isValidOTP = this.confirmOtp(user, otp, OTP_TYPE.FORGET_PASSWORD);

    if (!isValidOTP) throw new BadRequestException(messages.otp.isInvalid);

    await user.updateOne({
      password: hash(newPassword),
      $pull: {
        otp: { code: user.otp.map((o) => compare(otp, o.code)) },
      },
    });

    return;
  }
}
