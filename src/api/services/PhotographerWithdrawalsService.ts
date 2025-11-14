/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PhotographerWithdrawalsService {
    /**
     * List withdrawal requests
     * Get all withdrawal requests for the photographer with pagination, ordered by most recent first
     * @returns any Withdrawal requests retrieved successfully
     * @throws ApiError
     */
    public static f38E6C8B25031766666792874007A4F8(): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                id?: string;
                photographer_id?: string;
                /**
                 * Withdrawal amount in FCFA
                 */
                amount?: number;
                payment_method?: 'mobile_money' | 'bank_transfer';
                payment_details?: Record<string, any>;
                status?: 'pending' | 'approved' | 'completed' | 'rejected';
                created_at?: string;
                processed_at?: string | null;
            }>;
            current_page?: number;
            per_page?: number;
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/withdrawals',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Create withdrawal request
     * Request a withdrawal from available balance. Minimum amount: 10,000 FCFA. Amount must not exceed available balance.
     * @param requestBody
     * @returns any Withdrawal request created successfully
     * @throws ApiError
     */
    public static c1Bbe4Eab25230Fecc17373F83F6E109(
        requestBody: {
            /**
             * Withdrawal amount in FCFA (minimum: 10,000)
             */
            amount: number;
            payment_method: 'mobile_money' | 'bank_transfer';
            /**
             * Payment details based on method
             */
            payment_details: Record<string, any>;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            id?: string;
            photographer_id?: string;
            amount?: number;
            payment_method?: string;
            payment_details?: Record<string, any>;
            status?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/photographer/withdrawals',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Insufficient balance or validation error`,
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get withdrawal details
     * Retrieve detailed information about a specific withdrawal request. Only the request owner can view.
     * @param withdrawal Withdrawal UUID
     * @returns any Withdrawal details retrieved successfully
     * @throws ApiError
     */
    public static bd04836C1Fbf54D5C678D35C2B258296(
        withdrawal: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            id?: string;
            photographer_id?: string;
            amount?: number;
            payment_method?: 'mobile_money' | 'bank_transfer';
            payment_details?: Record<string, any>;
            status?: 'pending' | 'approved' | 'completed' | 'rejected';
            admin_notes?: string | null;
            created_at?: string;
            processed_at?: string | null;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/withdrawals/{withdrawal}',
            path: {
                'withdrawal': withdrawal,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - user is not the withdrawal owner`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Cancel withdrawal request
     * Cancel a pending withdrawal request. Only pending requests can be cancelled by the owner.
     * @param withdrawal Withdrawal UUID
     * @returns any Withdrawal request cancelled successfully
     * @throws ApiError
     */
    public static d854Fccd76C827379C744C2F5E35A6A(
        withdrawal: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/photographer/withdrawals/{withdrawal}',
            path: {
                'withdrawal': withdrawal,
            },
            errors: {
                400: `Cannot cancel - withdrawal not pending or unauthorized`,
                401: `Unauthorized - Authentication required`,
                404: `Resource not found`,
            },
        });
    }
}
