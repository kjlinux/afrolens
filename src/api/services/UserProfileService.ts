/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserProfileService {
    /**
     * Get current user profile
     * Retrieve the authenticated user's profile information including photographer profile if available
     * @returns any Profile retrieved successfully
     * @throws ApiError
     */
    public static f982Fed939320696F49Aae69E0D6(): CancelablePromise<{
        success?: boolean;
        data?: {
            id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            phone?: string | null;
            bio?: string | null;
            avatar_url?: string | null;
            role?: 'user' | 'photographer' | 'admin';
            created_at?: string;
            photographer_profile?: {
                id?: string;
                status?: 'pending' | 'approved' | 'rejected';
                portfolio_url?: string | null;
                total_revenue?: number;
            } | null;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/profile',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Update user profile
     * Update the authenticated user's profile information (first name, last name, phone, bio)
     * @param requestBody
     * @returns any Profile updated successfully
     * @throws ApiError
     */
    public static ed1Eeb1Dca260Eaf9823A1164A32738C(
        requestBody: {
            /**
             * User's first name
             */
            first_name?: string;
            /**
             * User's last name
             */
            last_name?: string;
            /**
             * User's phone number
             */
            phone?: string | null;
            /**
             * User biography
             */
            bio?: string | null;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            id?: string;
            first_name?: string;
            last_name?: string;
            email?: string;
            phone?: string | null;
            bio?: string | null;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Update user avatar
     * Upload and update the authenticated user's avatar image (max 2MB)
     * @param formData
     * @returns any Avatar updated successfully
     * @throws ApiError
     */
    public static e2D2514A22B7Fd00C76D733Aba3936A2(
        formData: {
            /**
             * Avatar image file (JPEG, PNG, GIF, max 2MB)
             */
            avatar: Blob;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/profile/avatar',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Update user password
     * Change the authenticated user's password (requires current password verification)
     * @param requestBody
     * @returns any Password updated successfully
     * @throws ApiError
     */
    public static a242B9024697A504E108E26A89F2(
        requestBody: {
            /**
             * Current password for verification
             */
            current_password: string;
            /**
             * New password (min 8 characters)
             */
            password: string;
            /**
             * Password confirmation (must match password)
             */
            password_confirmation: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/profile/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Current password incorrect`,
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
}
