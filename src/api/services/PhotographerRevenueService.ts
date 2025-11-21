/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PhotographerRevenueService {
    /**
     * List all revenue records
     * Get paginated list of all revenue records for the photographer. Each sale generates revenue after 20% platform commission.
     * @returns any Revenue records retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerRevenue(): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                id?: string;
                photographer_id?: string;
                /**
                 * Month of the revenue record
                 */
                month?: string;
                /**
                 * Total sales amount in FCFA
                 */
                total_sales?: number;
                /**
                 * Platform commission (20%) in FCFA
                 */
                commission?: number;
                /**
                 * Photographer's net revenue (80%) in FCFA
                 */
                net_revenue?: number;
                /**
                 * Available balance for withdrawal in FCFA
                 */
                available_balance?: number;
                /**
                 * Pending balance in FCFA
                 */
                pending_balance?: number;
                /**
                 * Amount already withdrawn in FCFA
                 */
                withdrawn?: number;
                /**
                 * Number of sales
                 */
                sales_count?: number;
                /**
                 * Number of unique photos sold
                 */
                photos_sold?: number;
            }>;
            current_page?: number;
            per_page?: number;
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/revenue',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get available balance
     * Get the total available balance ready for withdrawal (revenue where available_at <= now). This is the photographer's 80% share after 20% platform commission.
     * @returns any Available balance retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerRevenueAvailable(): CancelablePromise<{
        success?: boolean;
        data?: {
            /**
             * Total available balance in FCFA ready for withdrawal
             */
            available_amount?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/revenue/available',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get pending revenue
     * Get all revenue records that are not yet available for withdrawal (available_at > now). Typically held for a period before becoming available.
     * @returns any Pending revenue retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerRevenuePending(): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            id?: string;
            photographer_id?: string;
            /**
             * Month of the revenue record
             */
            month?: string;
            /**
             * Total sales amount in FCFA
             */
            total_sales?: number;
            /**
             * Platform commission (20%) in FCFA
             */
            commission?: number;
            /**
             * Photographer's net revenue (80%) in FCFA
             */
            net_revenue?: number;
            /**
             * Available balance for withdrawal in FCFA
             */
            available_balance?: number;
            /**
             * Pending balance in FCFA
             */
            pending_balance?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/revenue/pending',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get revenue history by month
     * Get monthly revenue summary with total earnings and sales count. Shows photographer's 80% share after 20% platform commission.
     * @returns any Revenue history retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerRevenueHistory(): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                /**
                 * Month of sales
                 */
                month?: string;
                /**
                 * Total photographer earnings for the month in FCFA
                 */
                total?: number;
                /**
                 * Number of sales in this month
                 */
                sales?: number;
            }>;
            current_page?: number;
            per_page?: number;
            /**
             * Total number of months with sales
             */
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/revenue/history',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get recent detailed transactions
     * Get paginated list of individual sales transactions with detailed information including photo title, sale date, net amount, and status.
     * @param perPage Number of transactions per page
     * @param status Filter by transaction status
     * @returns any Transactions retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerRevenueTransactions(
        perPage: number = 15,
        status?: 'completed' | 'pending',
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                /**
                 * Transaction ID (OrderItem ID)
                 */
                id?: string;
                /**
                 * Photo title
                 */
                description?: string;
                /**
                 * Sale date
                 */
                date?: string;
                /**
                 * Net amount for photographer in FCFA (80% of sale)
                 */
                amount?: number;
                /**
                 * Gross sale amount in FCFA
                 */
                gross_amount?: number;
                /**
                 * Platform commission in FCFA (20%)
                 */
                commission?: number;
                /**
                 * Transaction status
                 */
                status?: 'completed' | 'pending';
                /**
                 * Photo ID
                 */
                photo_id?: string;
                /**
                 * Photo thumbnail URL
                 */
                photo_thumbnail?: string;
                /**
                 * License type purchased
                 */
                license_type?: string;
                /**
                 * Order number
                 */
                order_number?: string;
            }>;
            current_page?: number;
            per_page?: number;
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/revenue/transactions',
            query: {
                'per_page': perPage,
                'status': status,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
}
