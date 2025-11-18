/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPhotographersService {
    /**
     * Get all photographers
     * Retrieve all photographers with filtering by status and search capabilities. Requires admin role.
     * @param status Filter by photographer profile status
     * @param search Search by name or email
     * @param perPage Number of items per page
     * @returns any Photographers retrieved successfully
     * @throws ApiError
     */
    public static getAdminPhotographers(
        status?: 'pending' | 'approved' | 'rejected',
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
            url: '/api/admin/photographers',
            query: {
                'status': status,
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
     * Get pending photographer profiles
     * Retrieve all photographer profiles awaiting approval. Requires admin role.
     * @param perPage Number of items per page
     * @returns any Pending photographers retrieved successfully
     * @throws ApiError
     */
    public static getAdminPhotographersPending(
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
            url: '/api/admin/photographers/pending',
            query: {
                'per_page': perPage,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get photographer details
     * Retrieve detailed information about a specific photographer including profile, recent photos, and statistics (total photos, sales, downloads). Requires admin role.
     * @param photographer Photographer UUID
     * @returns any Photographer details retrieved successfully
     * @throws ApiError
     */
    public static getAdminPhotographer(
        photographer: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/photographers/{photographer}',
            path: {
                'photographer': photographer,
            },
            errors: {
                400: `User is not a photographer`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photographer not found`,
            },
        });
    }
    /**
     * Approve photographer profile
     * Approve a pending photographer profile, allowing them to upload and sell photos on the platform. Requires admin role.
     * @param photographer Photographer UUID
     * @returns any Photographer profile approved successfully
     * @throws ApiError
     */
    public static approveAdminPhotographer(
        photographer: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/photographers/{photographer}/approve',
            path: {
                'photographer': photographer,
            },
            errors: {
                400: `Invalid request (not a photographer or already approved)`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photographer or profile not found`,
            },
        });
    }
    /**
     * Reject photographer profile
     * Reject a pending photographer profile with optional rejection reason. Requires admin role.
     * @param photographer Photographer UUID
     * @param requestBody
     * @returns any Photographer profile rejected successfully
     * @throws ApiError
     */
    public static rejectAdminPhotographer(
        photographer: string,
        requestBody?: {
            /**
             * Reason for rejection
             */
            rejection_reason?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/photographers/{photographer}/reject',
            path: {
                'photographer': photographer,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request (not a photographer or already rejected)`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photographer or profile not found`,
            },
        });
    }
    /**
     * Suspend photographer account
     * Suspend a photographer's account, preventing them from accessing the platform. Requires admin role.
     * @param photographer Photographer UUID
     * @returns any Photographer account suspended successfully
     * @throws ApiError
     */
    public static suspendAdminPhotographer(
        photographer: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/photographers/{photographer}/suspend',
            path: {
                'photographer': photographer,
            },
            errors: {
                400: `User is not a photographer`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photographer not found`,
            },
        });
    }
    /**
     * Activate photographer account
     * Activate a suspended photographer's account, restoring their access to the platform. Requires admin role.
     * @param photographer Photographer UUID
     * @returns any Photographer account activated successfully
     * @throws ApiError
     */
    public static activateAdminPhotographer(
        photographer: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/photographers/{photographer}/activate',
            path: {
                'photographer': photographer,
            },
            errors: {
                400: `User is not a photographer`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photographer not found`,
            },
        });
    }
}
