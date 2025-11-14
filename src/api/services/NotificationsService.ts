/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Get all user notifications
     * Retrieve all notifications for the authenticated user with pagination (20 per page)
     * @param page Page number for pagination
     * @returns any Notifications retrieved successfully
     * @throws ApiError
     */
    public static ee6A891D459Ba2173E2A9Aeec8F2(
        page: number = 1,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                id?: string;
                user_id?: string;
                type?: 'order_completed' | 'new_sale' | 'withdrawal_processed' | 'photo_approved' | 'photo_rejected';
                title?: string;
                message?: string;
                data?: Record<string, any> | null;
                read_at?: string | null;
                created_at?: string;
            }>;
            current_page?: number;
            per_page?: number;
            total?: number;
            last_page?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/notifications',
            query: {
                'page': page,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get unread notifications
     * Retrieve only unread notifications for the authenticated user (no pagination)
     * @returns any Unread notifications retrieved successfully
     * @throws ApiError
     */
    public static d34B6B678E744E1169D84Ac475E63Cd8(): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            id?: string;
            user_id?: string;
            type?: 'order_completed' | 'new_sale' | 'withdrawal_processed' | 'photo_approved' | 'photo_rejected';
            title?: string;
            message?: string;
            data?: Record<string, any> | null;
            read_at?: string | null;
            created_at?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/notifications/unread',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Mark notification as read
     * Mark a specific notification as read for the authenticated user
     * @param notification Notification UUID
     * @returns any Notification marked as read successfully
     * @throws ApiError
     */
    public static b3C173F2963Bc54D9D0A541Dfd33C(
        notification: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/notifications/{notification}/read',
            path: {
                'notification': notification,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - notification doesn't belong to user`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Mark all notifications as read
     * Mark all unread notifications as read for the authenticated user
     * @returns any All notifications marked as read successfully
     * @throws ApiError
     */
    public static ab4F4C7283D29454F4716C40348Fcf6(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/notifications/read-all',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Delete notification
     * Delete a specific notification for the authenticated user
     * @param notification Notification UUID to delete
     * @returns any Notification deleted successfully
     * @throws ApiError
     */
    public static b986B490223C6B35Ac535Ba8Cd3C2(
        notification: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/notifications/{notification}',
            path: {
                'notification': notification,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - notification doesn't belong to user`,
                404: `Resource not found`,
            },
        });
    }
}
