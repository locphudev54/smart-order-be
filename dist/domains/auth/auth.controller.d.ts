import { AccountType } from 'core/types/type';
import { AuthService } from 'domains/auth/auth.service';
import { ChangePasswordDto } from 'domains/auth/dtos/change-password.dto';
import { ForgotPasswordtDto } from 'domains/auth/dtos/forgot-password.dto';
import { LoginOAuthDto } from 'domains/auth/dtos/login-oauth.dto';
import { LoginDto } from 'domains/auth/dtos/login.dto';
import { LogoutDto } from 'domains/auth/dtos/logout.dto';
import { RefreshTokenDto } from 'domains/auth/dtos/refresh-token.dto';
import { RegisterAccountDto } from 'domains/auth/dtos/register-account-dto';
import { UpdateProfileDto } from 'domains/auth/dtos/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, req: any): Promise<{
        accessToken: string;
        refreshToken: string;
        account: AccountType;
    }>;
    handleOAuth(loginOAuthBody: LoginOAuthDto): Promise<{
        accessToken: string;
        refreshToken: string;
        account: AccountType;
    }>;
    register(registerAccountDto: RegisterAccountDto): Promise<{
        accessToken: string;
        refreshToken: string;
        account: {
            _id: import("mongoose").Types.ObjectId;
            email: string;
            fullName: string;
            avatarUrl: string;
            role: import("../../core/constants/enum").Role;
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
            role: import("../../core/constants/enum").Role;
        };
    }>;
    forgotPassword(forgotPasswordtDto: ForgotPasswordtDto): Promise<import("mongoose").UpdateWriteOpResult>;
    changePassword(changePasswordDto: ChangePasswordDto, account: AccountType): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    updateProfile(updateProfileDto: UpdateProfileDto, account: AccountType): Promise<import("mongoose").UpdateWriteOpResult>;
    logout(logoutDto: LogoutDto): Promise<void>;
}
