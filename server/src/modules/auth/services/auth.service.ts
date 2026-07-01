import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { RedisService } from '../../database/redis.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, fullName, password, timezone, locale } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, this.configService.get<number>('BCRYPT_ROUNDS', 12));

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        fullName,
        passwordHash,
        timezone: timezone || 'UTC',
        locale: locale || 'en',
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        timezone: true,
        locale: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    // Store refresh token hash in database
    const refreshTokenHash = await bcrypt.hash(refreshToken, this.configService.get<number>('BCRYPT_ROUNDS', 12));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        expiresAt,
      },
    });

    // Store refresh token in Redis for quick validation
    await this.redis.set(`refresh_token:${user.id}:${refreshTokenHash}`, 'valid', 30 * 24 * 60 * 60); // 30 days in seconds

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, device } = loginDto;

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    // Store refresh token
    const refreshTokenHash = await bcrypt.hash(refreshToken, this.configService.get<number>('BCRYPT_ROUNDS', 12));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        device,
        expiresAt,
      },
    });

    await this.redis.set(`refresh_token:${user.id}:${refreshTokenHash}`, 'valid', 30 * 24 * 60 * 60);

    // Return user data without password hash (already excluded by select)
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      // Decode refresh token to get user ID
      const payload = this.jwtService.decode(refreshToken) as { sub: string };
      if (!payload?.sub) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const userId = payload.sub;

      // Find all active sessions for this user
      const sessions = await this.prisma.session.findMany({
        where: {
          userId,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      // Check if any session matches the refresh token
      let validSession = null;
      for (const session of sessions) {
        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (isValid) {
          validSession = session;
          break;
        }
      }

      if (!validSession) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Revoke old session (rotation)
      await this.prisma.session.update({
        where: { id: validSession.id },
        data: { revokedAt: new Date() },
      });

      // Remove old refresh token from Redis
      await this.redis.del(`refresh_token:${userId}:${validSession.refreshTokenHash}`);

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens(userId);

      // Store new refresh token
      const newRefreshTokenHash = await bcrypt.hash(
        newRefreshToken,
        this.configService.get<number>('BCRYPT_ROUNDS', 12)
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await this.prisma.session.create({
        data: {
          userId,
          refreshTokenHash: newRefreshTokenHash,
          expiresAt,
        },
      });

      await this.redis.set(`refresh_token:${userId}:${newRefreshTokenHash}`, 'valid', 30 * 24 * 60 * 60);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      // Find and revoke the specific session
      const sessions = await this.prisma.session.findMany({
        where: {
          userId,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      for (const session of sessions) {
        const isValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
        if (isValid) {
          await this.prisma.session.update({
            where: { id: session.id },
            data: { revokedAt: new Date() },
          });
          await this.redis.del(`refresh_token:${userId}:${session.refreshTokenHash}`);
          break;
        }
      }
    }
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatar: true,
        timezone: true,
        locale: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY', '15m'),
      }
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY', '30d'),
      }
    );

    return { accessToken, refreshToken };
  }
}
