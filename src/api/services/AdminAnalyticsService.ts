/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAnalyticsService {
    /**
     * Get revenue analytics
     * Retrieve revenue analytics with daily breakdown for a specified time period. Shows total revenue and daily revenue trends. Requires admin role.
     * @param period Time period for analytics
     * @returns any Revenue analytics retrieved successfully
     * @throws ApiError
     */
    public static f7E3Bbc8333De2385D1E9Dc470Da368(
        period: '7days' | '30days' | '90days' | 'year' = '30days',
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            period?: string;
            start_date?: string;
            end_date?: string;
            total_revenue?: number;
            daily_revenue?: Array<{
                date?: string;
                total_revenue?: number;
                order_count?: number;
            }>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/analytics/revenue',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get sales analytics
     * Retrieve sales analytics including total orders, photos sold, average order value, and top selling photos for a specified time period. Requires admin role.
     * @param period Time period for analytics
     * @returns any Sales analytics retrieved successfully
     * @throws ApiError
     */
    public static da2592B88F216B7D8E6268Ab5C9940(
        period: '7days' | '30days' | '90days' | 'year' = '30days',
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            period?: string;
            total_orders?: number;
            total_photos_sold?: number;
            average_order_value?: number;
            /**
             * Top 10 best-selling photos in the period
             */
            top_selling_photos?: Array<Record<string, any>>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/analytics/sales',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get photographer analytics
     * Retrieve analytics for top 20 photographers ranked by total earnings, including approved photos count and total earnings. Requires admin role.
     * @returns any Photographer analytics retrieved successfully
     * @throws ApiError
     */
    public static e6Ee5449E4E1Af04C79A74037B7Adfc(): CancelablePromise<{
        success?: boolean;
        data?: {
            /**
             * Top 20 photographers by earnings
             */
            top_photographers?: Array<{
                id?: string;
                first_name?: string;
                last_name?: string;
                email?: string;
                created_at?: string;
                approved_photos_count?: number;
                total_earnings?: number;
            }>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/analytics/photographers',
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
    /**
     * Get user growth analytics
     * Retrieve user growth analytics showing daily new user registrations grouped by account type for a specified time period. Requires admin role.
     * @param period Time period for analytics
     * @returns any User growth analytics retrieved successfully
     * @throws ApiError
     */
    public static c5049326F73Fc64Dee8B801E754Fc4Fd(
        period: '7days' | '30days' | '90days' | 'year' = '30days',
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            period?: string;
            /**
             * User registrations grouped by date and account type
             */
            user_growth?: Record<string, any>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/analytics/user-growth',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
}
