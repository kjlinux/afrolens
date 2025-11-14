/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUsersService {
    /**
     * Get all users with filtering
     * Retrieve all users with advanced filtering options by account type, active status, and search term. Requires admin role.
     * @param accountType Filter by account type
     * @param isActive Filter by active status
     * @param search Search by name or email
     * @param perPage Number of items per page
     * @returns any Users retrieved successfully
     * @throws ApiError
     */
    public static ded17315E13756Cd593B5840Cd39A26(
        accountType?: 'buyer' | 'photographer' | 'admin',
        isActive?: boolean,
        search?: string,
        perPage: number = 20,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            current_page?: number;
            data?: Array<Record<string, any>>;
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
            query: {
                'account_type': accountType,
                'is_active': isActive,
                'search': search,
                'per_page': perPage,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get user details
     * Retrieve detailed information about a specific user. For photographers, includes profile and recent photos. Requires admin role.
     * @param user User UUID
     * @returns any User details retrieved successfully
     * @throws ApiError
     */
    public static e6Ac1393C92A407Ec78308857C0E(
        user: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users/{user}',
            path: {
                'user': user,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Delete user account
     * Soft delete a user account. Admin accounts cannot be deleted. Requires admin role.
     * @param user User UUID
     * @returns any User account deleted successfully
     * @throws ApiError
     */
    public static b96Bca56895875C78781639320F633(
        user: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/users/{user}',
            path: {
                'user': user,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Cannot delete admin account or admin role required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Suspend user account
     * Suspend a user's account, preventing them from accessing the platform. Requires admin role.
     * @param user User UUID
     * @returns any User account suspended successfully
     * @throws ApiError
     */
    public static c42Bdb31874134C6Cdac109Fe(
        user: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{user}/suspend',
            path: {
                'user': user,
            },
            errors: {
                400: `Account already suspended`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `User not found`,
            },
        });
    }
    /**
     * Activate user account
     * Activate a suspended user's account, restoring their access to the platform. Requires admin role.
     * @param user User UUID
     * @returns any User account activated successfully
     * @throws ApiError
     */
    public static f501F5364Ae2Acb64C8B709131A923Cf(
        user: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{user}/activate',
            path: {
                'user': user,
            },
            errors: {
                400: `Account already active`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `User not found`,
            },
        });
    }
}
