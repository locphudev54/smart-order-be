import { SocialProvider } from 'core/constants/enum';
export declare class LoginOAuthDto {
    email: string;
    avatarUrl?: string;
    provider: SocialProvider;
    accessToken: string;
}
