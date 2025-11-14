/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PhotographerDashboardService {
    /**
     * Get photographer dashboard
     * Comprehensive dashboard with photo statistics, revenue (80% photographer share after 20% platform commission), sales data, and recent activity
     * @returns any Dashboard data retrieved successfully
     * @throws ApiError
     */
    public static ca3Be02D9Ba17Cae694A7B0F111575B(): CancelablePromise<{
        success?: boolean;
        data?: {
            photos?: {
                /**
                 * Total photos uploaded
                 */
                total?: number;
                /**
                 * Approved photos available for sale
                 */
                approved?: number;
                /**
                 * Photos pending moderation
                 */
                pending?: number;
                /**
                 * Rejected photos
                 */
                rejected?: number;
                /**
                 * Total views across all photos
                 */
                views?: number;
            };
            revenue?: {
                /**
                 * Available balance ready for withdrawal in FCFA
                 */
                available?: number;
                /**
                 * Pending revenue not yet available in FCFA
                 */
                pending?: number;
                /**
                 * Total lifetime earnings in FCFA
                 */
                total_earnings?: number;
                /**
                 * Current month earnings in FCFA
                 */
                this_month?: number;
            };
            sales?: {
                /**
                 * Total number of sales
                 */
                total_sales?: number;
                /**
                 * Total downloads across all sales
                 */
                total_downloads?: number;
                /**
                 * Sales this month
                 */
                this_month_sales?: number;
            };
            /**
             * 5 most recent sales with photo and order details
             */
            recent_sales?: Array<Record<string, any>>;
            /**
             * 5 most recently uploaded photos
             */
            recent_photos?: Array<Record<string, any>>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/dashboard',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get photographer profile statistics
     * Get profile completion percentage, average photo pricing, and best-selling photo information
     * @returns any Profile statistics retrieved successfully
     * @throws ApiError
     */
    public static d5D3E0A9F0786Deea0729B7530Daff(): CancelablePromise<{
        success?: boolean;
        data?: {
            /**
             * Profile completion percentage (0-100)
             */
            profile_completion?: number;
            /**
             * Average price of approved photos in FCFA
             */
            average_photo_price?: number;
            /**
             * Photo with most sales
             */
            best_selling_photo?: {
                id?: string;
                title?: string;
                /**
                 * Number of times sold
                 */
                order_items_count?: number;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/dashboard/stats',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
}
