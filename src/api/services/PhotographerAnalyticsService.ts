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
    /**
     * Get views over time
     * Get historical view counts for photographer's photos over a specified period
     * @param period Analytics period
     * @returns any Views data retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerViewsOverTime(
        period: '7d' | '30d' | '90d',
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            date?: string;
            views?: number;
        }>;
        summary?: {
            total_views?: number;
            average_daily_views?: number;
            change_percentage?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/views-over-time',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get sales over time
     * Get historical sales counts over a specified period
     * @param period Analytics period
     * @returns any Sales data retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerSalesOverTime(
        period: '7d' | '30d' | '90d',
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            date?: string;
            sales?: number;
        }>;
        summary?: {
            total_sales?: number;
            average_daily_sales?: number;
            change_percentage?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/sales-over-time',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get revenue over time
     * Get historical revenue data (photographer's 80% share after commission) over a specified period
     * @param period Analytics period
     * @returns any Revenue data retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerRevenueOverTime(
        period: '7d' | '30d' | '90d',
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            date?: string;
            revenue?: number;
        }>;
        summary?: {
            total_revenue?: number;
            average_daily_revenue?: number;
            change_percentage?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/revenue-over-time',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get conversion rate over time
     * Get historical conversion rate (views to sales) over a specified period
     * @param period Analytics period
     * @returns any Conversion data retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerConversionOverTime(
        period: '7d' | '30d' | '90d',
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            date?: string;
            conversion_rate?: number;
        }>;
        summary?: {
            average_conversion_rate?: number;
            change_percentage?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/conversion-over-time',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get hourly distribution
     * Analyze which hours of the day photos are most viewed or purchased
     * @param period Analytics period
     * @param metric Metric to analyze
     * @returns any Hourly distribution retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerHourlyDistribution(
        period: '7d' | '30d' | '90d',
        metric: 'views' | 'sales' = 'views',
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            hour?: number;
            value?: number;
        }>;
        peak_hours?: Array<number>;
        lowest_hours?: Array<number>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/hourly-distribution',
            query: {
                'period': period,
                'metric': metric,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get performance by category
     * Analyze photo performance grouped by category
     * @param period Analytics period
     * @returns any Category performance retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerCategoryPerformance(
        period: '7d' | '30d' | '90d',
    ): CancelablePromise<{
        success?: boolean;
        data?: Array<{
            category_id?: string;
            category_name?: string;
            total_sales?: number;
            total_revenue?: number;
            total_views?: number;
            conversion_rate?: number;
            average_price?: number;
        }>;
        top_category?: {
            by_sales?: string;
            by_revenue?: string;
            by_conversion?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/analytics/category-performance',
            query: {
                'period': period,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
}
