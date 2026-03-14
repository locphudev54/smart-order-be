import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'core/constants/enum';
import { AccountType } from 'core/types/type';
import { AccountsService } from 'domains/accounts/accounts.service';
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto';
import { ForgotPasswordtDto } from 'domains/auth/dtos/forgot-password.dto';
import { LoginOAuthDto } from 'domains/auth/dtos/login-oauth.dto';
import { LogoutDto } from 'domains/auth/dtos/logout.dto';
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto';
import { RegisterAccountDto } from 'domains/auth/dtos/register-account-dto';
import mongoose from 'mongoose';
import { UpdateProfileDto } from './dtos/update-profile.dto';
export declare class AuthService {
    private readonly accountsService;
    private readonly jwtService;
    private readonly configService;
    constructor(accountsService: AccountsService, jwtService: JwtService, configService: ConfigService);
    validateAccount(email: string, password: string): Promise<{
        _id: mongoose.Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.Connection;
        errors?: mongoose.Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: mongoose.Schema;
        email: string;
        fullName: string;
        avatarUrl: string;
        role: Role;
        refreshToken: string;
        __v: number;
    }>;
    login(account: AccountType): Promise<{
        accessToken: string;
        refreshToken: string;
        account: AccountType;
    }>;
    loginOAuth(loginOAuthBody: LoginOAuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
        account: AccountType;
    }>;
    register(registerAccountDto: RegisterAccountDto): Promise<{
        accessToken: string;
        refreshToken: string;
        account: {
            _id: mongoose.Types.ObjectId;
            email: string;
            fullName: string;
            avatarUrl: string;
            role: Role;
        };
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        account: {
            _id: string;
            email: string;
            fullName: string;
            avatarUrl: string;
            role: Role;
        };
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordtDto): Promise<mongoose.UpdateWriteOpResult>;
    changePassword(changePasswordDto: ChangePasswordDto, account: AccountType): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(logoutDto: LogoutDto): Promise<void>;
    updateProfile(updateProfileDto: UpdateProfileDto, account: AccountType): Promise<mongoose.UpdateWriteOpResult>;
    signAccessToken(payload: AccountType): Promise<string>;
    signRefreshToken(payload: AccountType, exp?: number): Promise<string>;
    getUserFromAuthenticationToken(token: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, import("../accounts/schemas/account.schema").Account, {}, {}> & import("../accounts/schemas/account.schema").Account & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & mongoose.Document<unknown, {}, import("../accounts/schemas/account.schema").Account, {}, {}> & import("../accounts/schemas/account.schema").Account & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: mongoose.Types.ObjectId;
    }>>;
    verifyOAuthToken(provider: string, token: string, email: string): Promise<boolean>;
}
