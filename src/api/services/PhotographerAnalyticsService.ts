/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PhotographerAnalyticsService {
    /**
     * Get sales analytics
     * Get sales analytics for a specified period (7, 30, or 90 days). Revenue shown is photographer's 80% share after 20% platform commission.
     * @param period Analytics period
     * @returns any Sales analytics retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerAnalyticsSales(
        period: '7days' | '30days' | '90days' = '30days',
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            /**
             * Total number of sales in the period
             */
            total_sales?: number;
            /**
             * Total photographer revenue (80% share) in FCFA
             */
            total_revenue?: number;
            /**
             * Average revenue per sale in FCFA
             */
            average_sale?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/sales',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Get popular photos
     * Get top 10 best-selling photos ranked by total number of sales
     * @returns any Popular photos retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerAnalyticsPopularPhotos(): CancelablePromise<{
        success?: boolean;
        /**
         * Top 10 photos by sales count
         */
        data?: Array<{
            id?: string;
            title?: string;
            thumbnail_url?: string;
            price_standard?: number;
            price_extended?: number;
            view_count?: number;
            /**
             * Total number of times this photo was sold
             */
            order_items_count?: number;
            created_at?: string;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/popular-photos',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
}
