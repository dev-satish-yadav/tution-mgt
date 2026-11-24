import crypto from 'crypto';
import { User, IUser } from '../users/user.model.js';
import { RefreshToken } from './refresh-token.model.js';
import { StudentProfile } from '../students/student.model.js';
import { TeacherProfile } from '../teachers/teacher.model.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt.js';
import { AppError } from '../../common/errors/app.error.js';

export class AuthService {
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async login(email: string, password: string, portal?: 'admin' | 'portal') {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Your account has been deactivated. Please contact the administrator.');
    }

    // Enforce portal isolation according to specification:
    // Admin login (/admin/login) must only authenticate ADMIN accounts.
    // Shared login (/login) must only authenticate STUDENT and TEACHER accounts.
    if (portal === 'admin' && user.role !== 'ADMIN') {
      throw AppError.forbidden('Access denied. This login portal is restricted to administrators only.');
    }

    if (portal === 'portal' && user.role === 'ADMIN') {
      throw AppError.forbidden('Administrators must log in through the dedicated Admin Portal.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const payload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token record
    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      user: user._id,
      tokenHash,
      expiresAt,
    });

    user.lastLogin = new Date();
    await user.save();

    // Fetch role-specific details
    let profileData: any = null;
    if (user.role === 'STUDENT') {
      profileData = await StudentProfile.findOne({ user: user._id }).populate('batch');
    } else if (user.role === 'TEACHER') {
      profileData = await TeacherProfile.findOne({ user: user._id });
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        profile: profileData,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refresh(token: string) {
    let payload;
    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw AppError.unauthorized('Invalid or expired refresh token');
    }

    const tokenHash = this.hashToken(token);
    const tokenDoc = await RefreshToken.findOne({ tokenHash, user: payload.userId });

    if (!tokenDoc) {
      // Possible token reuse attack - delete all tokens for this user
      await RefreshToken.deleteMany({ user: payload.userId });
      throw AppError.unauthorized('Invalid refresh token session. Please log in again.');
    }

    // Remove old token document (token rotation)
    await tokenDoc.deleteOne();

    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('User account no longer active');
    }

    const newPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    // Store new refresh token
    await RefreshToken.create({
      user: user._id,
      tokenHash: this.hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, token?: string) {
    if (token) {
      const tokenHash = this.hashToken(token);
      await RefreshToken.deleteOne({ tokenHash, user: userId });
    } else {
      await RefreshToken.deleteMany({ user: userId });
    }
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found');
    }

    let profileData: any = null;
    if (user.role === 'STUDENT') {
      profileData = await StudentProfile.findOne({ user: user._id }).populate('batch');
    } else if (user.role === 'TEACHER') {
      profileData = await TeacherProfile.findOne({ user: user._id });
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      isActive: user.isActive,
      profile: profileData,
    };
  }
}

export const authService = new AuthService();
