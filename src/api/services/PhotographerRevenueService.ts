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
    public static bd3F03689B56Aab703Ed9342A2F4Be6(): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                id?: string;
                photographer_id?: string;
                photo_id?: string;
                photo?: {
                    id?: string;
                    title?: string;
                };
                /**
                 * Photographer's share (80%) in FCFA
                 */
                photographer_amount?: number;
                /**
                 * Platform commission (20%) in FCFA
                 */
                platform_commission?: number;
                sold_at?: string;
                /**
                 * When revenue becomes available for withdrawal
                 */
                available_at?: string;
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
    public static c25F98A4Da9C9E158526A0F3C31Ab9(): CancelablePromise<{
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
    public static b16Db1C03Af07E4E7140Ee1A05F173(): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            id?: string;
            photographer_id?: string;
            photo_id?: string;
            photo?: {
                id?: string;
                title?: string;
            };
            /**
             * Photographer's share (80%) in FCFA
             */
            photographer_amount?: number;
            sold_at?: string;
            /**
             * When this revenue will become available
             */
            available_at?: string;
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
     * Get revenue history by date
     * Get daily revenue summary with total earnings and sales count, grouped by date. Shows photographer's 80% share after 20% platform commission.
     * @returns any Revenue history retrieved successfully
     * @throws ApiError
     */
    public static a10Dbaf5C1Bd533C259E1C969C98509E(): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                /**
                 * Date of sales
                 */
                date?: string;
                /**
                 * Total photographer earnings for the day in FCFA
                 */
                total?: number;
                /**
                 * Number of sales on this date
                 */
                sales?: number;
            }>;
            current_page?: number;
            per_page?: number;
            /**
             * Total number of days with sales
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
}
