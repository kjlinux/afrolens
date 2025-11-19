/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminPhotoModerationService {
    /**
     * Get pending photos for moderation
     * Retrieve all photos awaiting moderation review with photographer and category information. Requires admin role.
     * @param perPage Number of items per page
     * @param page Page number
     * @returns any Pending photos retrieved successfully
     * @throws ApiError
     */
    public static getAdminPhotosPending(
        perPage: number = 20,
        page: number = 1,
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
            url: '/api/admin/photos/pending',
            query: {
                'per_page': perPage,
                'page': page,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get all photos with filtering
     * Retrieve all photos with advanced filtering options by status, photographer, and search term. Requires admin role.
     * @param status Filter by moderation status
     * @param photographerId Filter by photographer UUID
     * @param search Search by photo title
     * @param perPage Number of items per page
     * @returns any Photos retrieved successfully
     * @throws ApiError
     */
    public static getAdminPhotos(
        status?: 'pending' | 'approved' | 'rejected',
        photographerId?: string,
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
            url: '/api/admin/photos',
            query: {
                'status': status,
                'photographer_id': photographerId,
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
     * Approve a photo
     * Approve a pending photo, making it publicly visible. The photo's moderation status is set to 'approved' and visibility is changed to 'public'. Requires admin role.
     * @param photo Photo UUID
     * @returns any Photo approved successfully
     * @throws ApiError
     */
    public static approveAdminPhoto(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/photos/{photo}/approve',
            path: {
                'photo': photo,
            },
            errors: {
                400: `Photo already approved`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photo not found`,
            },
        });
    }
    /**
     * Reject a photo
     * Reject a pending photo with optional rejection reason. The photo's moderation status is set to 'rejected' and visibility is changed to 'private'. Requires admin role.
     * @param photo Photo UUID
     * @param requestBody
     * @returns any Photo rejected successfully
     * @throws ApiError
     */
    public static rejectAdminPhoto(
        photo: string,
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
            method: 'POST',
            url: '/api/admin/photos/{photo}/reject',
            path: {
                'photo': photo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Photo already rejected`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photo not found`,
            },
        });
    }
    /**
     * Toggle photo featured status
     * Feature or unfeature an approved photo. Only approved photos can be featured. Requires admin role.
     * @param photo Photo UUID
     * @returns any Photo featured status toggled successfully
     * @throws ApiError
     */
    public static toggleAdminPhotoFeatured(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/photos/{photo}/toggle-featured',
            path: {
                'photo': photo,
            },
            errors: {
                400: `Photo not approved`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photo not found`,
            },
        });
    }
    /**
     * Delete a photo
     * Permanently delete a photo and its associated files from storage. This action cannot be undone. Requires admin role.
     * @param photo Photo UUID
     * @returns any Photo deleted successfully
     * @throws ApiError
     */
    public static deleteAdminPhoto(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/photos/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Photo not found`,
            },
        });
    }
    /**
     * Bulk approve photos
     * Approve multiple pending photos at once. Only pending photos will be updated. All specified photos will have their moderation status set to 'approved' and visibility changed to 'public'. Requires admin role.
     * @param requestBody
     * @returns any Photos approved successfully
     * @throws ApiError
     */
    public static bulkApproveAdminPhotos(
        requestBody: {
            /**
             * Array of photo UUIDs to approve
             */
            photo_ids: Array<string>;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/photos/bulk-approve',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Bulk reject photos
     * Reject multiple pending photos at once with optional rejection reason. Only pending photos will be updated. All specified photos will have their moderation status set to 'rejected' and visibility changed to 'private'. Requires admin role.
     * @param requestBody
     * @returns any Photos rejected successfully
     * @throws ApiError
     */
    public static bulkRejectAdminPhotos(
        requestBody: {
            /**
             * Array of photo UUIDs to reject
             */
            photo_ids: Array<string>;
            /**
             * Reason for rejection applied to all photos
             */
            rejection_reason?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/photos/bulk-reject',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
}
