/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminWithdrawalsService {
    /**
     * Get all withdrawals with filtering
     * Retrieve all withdrawal requests with filtering by status and photographer. Requires admin role.
     * @param status Filter by withdrawal status
     * @param photographerId Filter by photographer UUID
     * @param perPage Number of items per page
     * @returns any Withdrawals retrieved successfully
     * @throws ApiError
     */
    public static getAdminWithdrawals(
        status?: 'pending' | 'approved' | 'rejected' | 'completed',
        photographerId?: string,
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
            url: '/api/admin/withdrawals',
            query: {
                'status': status,
                'photographer_id': photographerId,
                'per_page': perPage,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get pending withdrawals
     * Retrieve all pending withdrawal requests ordered by creation date. Requires admin role.
     * @param perPage Number of items per page
     * @returns any Pending withdrawals retrieved successfully
     * @throws ApiError
     */
    public static getAdminWithdrawalsPending(
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
            url: '/api/admin/withdrawals/pending',
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
     * Get withdrawal details
     * Retrieve detailed information about a specific withdrawal request including photographer contact information. Requires admin role.
     * @param withdrawal Withdrawal UUID
     * @returns any Withdrawal details retrieved successfully
     * @throws ApiError
     */
    public static getAdminWithdrawal(
        withdrawal: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/withdrawals/{withdrawal}',
            path: {
                'withdrawal': withdrawal,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Withdrawal not found`,
            },
        });
    }
    /**
     * Approve withdrawal request
     * Approve a pending withdrawal request with optional transaction reference and admin notes. Only pending requests can be approved. Requires admin role.
     * @param withdrawal Withdrawal UUID
     * @param requestBody
     * @returns any Withdrawal approved successfully
     * @throws ApiError
     */
    public static approveAdminWithdrawal(
        withdrawal: string,
        requestBody?: {
            /**
             * Transaction reference number
             */
            transaction_reference?: string;
            /**
             * Admin notes for internal tracking
             */
            admin_notes?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/withdrawals/{withdrawal}/approve',
            path: {
                'withdrawal': withdrawal,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Only pending requests can be approved`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Withdrawal not found`,
            },
        });
    }
    /**
     * Reject withdrawal request
     * Reject a pending withdrawal request with required rejection reason. Only pending requests can be rejected. Requires admin role.
     * @param withdrawal Withdrawal UUID
     * @param requestBody
     * @returns any Withdrawal rejected successfully
     * @throws ApiError
     */
    public static rejectAdminWithdrawal(
        withdrawal: string,
        requestBody: {
            /**
             * Reason for rejection
             */
            rejection_reason: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/withdrawals/{withdrawal}/reject',
            path: {
                'withdrawal': withdrawal,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Only pending requests can be rejected or validation error`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Withdrawal not found`,
            },
        });
    }
    /**
     * Mark withdrawal as completed
     * Mark an approved withdrawal as completed (payment sent) with required transaction reference. Only approved requests can be marked as completed. Requires admin role.
     * @param withdrawal Withdrawal UUID
     * @param requestBody
     * @returns any Withdrawal marked as completed successfully
     * @throws ApiError
     */
    public static completeAdminWithdrawal(
        withdrawal: string,
        requestBody: {
            /**
             * Transaction reference number confirming payment
             */
            transaction_reference: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/withdrawals/{withdrawal}/complete',
            path: {
                'withdrawal': withdrawal,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Only approved requests can be marked as completed or validation error`,
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Withdrawal not found`,
            },
        });
    }
}
