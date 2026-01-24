import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entities';
import { LoginDto, ChangePasswordDto } from './dto/auth.dto';
import { comparePassword, hashPassword } from '../common/utils/password.util';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 로그인
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 사용자 조회
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 비활성 계정 체크
    if (user.status === UserStatus.INACTIVE) {
      throw new ForbiddenException('비활성화된 계정입니다. 관리자에게 문의하세요.');
    }

    // 비밀번호 검증
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 마지막 로그인 시간 업데이트
    await this.userRepository.update(user.id, {
      last_login_at: new Date(),
    });

    // 토큰 생성
    const tokens = await this.generateTokens(user);

    // 민감한 정보 제거
    const { password_hash, ...userWithoutPassword } = user;

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: userWithoutPassword,
      must_change_password: user.must_change_password,
    };
  }

  /**
   * 로그아웃
   * 실제 구현에서는 refresh token을 블랙리스트에 추가하거나 DB에서 삭제
   */
  async logout(userId: string): Promise<{ success: true; message: string }> {
    // TODO: refresh token 무효화 로직 추가 (Redis 블랙리스트 등)
    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }

  /**
   * 토큰 갱신
   */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'merety-refresh-secret',
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('유효하지 않은 토큰입니다.');
      }

      if (user.status === UserStatus.INACTIVE) {
        throw new ForbiddenException('비활성화된 계정입니다.');
      }

      const newAccessToken = await this.generateAccessToken(user);

      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다.');
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getMe(user: User) {
    const { password_hash, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
    };
  }

  /**
   * 비밀번호 변경
   */
  async changePassword(user: User, dto: ChangePasswordDto) {
    const { current_password, new_password, confirm_password } = dto;

    // 새 비밀번호 확인
    if (new_password !== confirm_password) {
      throw new BadRequestException('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    }

    // 첫 로그인이 아닌 경우 현재 비밀번호 확인
    if (!user.must_change_password) {
      if (!current_password) {
        throw new BadRequestException('현재 비밀번호를 입력해주세요.');
      }

      const isCurrentPasswordValid = await comparePassword(
        current_password,
        user.password_hash,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('현재 비밀번호가 올바르지 않습니다.');
      }
    }

    // 새 비밀번호 해시 및 저장
    const newPasswordHash = await hashPassword(new_password);

    await this.userRepository.update(user.id, {
      password_hash: newPasswordHash,
      must_change_password: false,
    });

    return {
      success: true,
      message: '비밀번호가 변경되었습니다.',
    };
  }

  /**
   * Access Token + Refresh Token 생성
   */
  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'merety-refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return { access_token, refresh_token };
  }

  /**
   * Access Token만 생성
   */
  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
  }
}
