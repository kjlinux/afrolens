/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Order } from '../models/Order';
import type { PaginationLinks } from '../models/PaginationLinks';
import type { PaginationMeta } from '../models/PaginationMeta';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminOrdersService {
    /**
     * List all orders (admin)
     * Get all orders with pagination and filters. Requires admin role.
     * @param status Filter by payment status
     * @param userId Filter by buyer UUID
     * @param photographerId Filter by photographer UUID (orders containing their photos)
     * @param dateFrom Filter orders from this date (YYYY-MM-DD)
     * @param dateTo Filter orders until this date (YYYY-MM-DD)
     * @param search Search by order number
     * @param perPage Number of orders per page
     * @returns any Orders retrieved successfully
     * @throws ApiError
     */
    public static getAdminOrders(
        status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded',
        userId?: string,
        photographerId?: string,
        dateFrom?: string,
        dateTo?: string,
        search?: string,
        perPage: number = 20,
    ): CancelablePromise<{
        data?: Array<Order>;
        meta?: PaginationMeta;
        links?: PaginationLinks;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/orders',
            query: {
                'status': status,
                'user_id': userId,
                'photographer_id': photographerId,
                'date_from': dateFrom,
                'date_to': dateTo,
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
     * Get order details (admin)
     * Retrieve detailed information about a specific order. Requires admin role.
     * @param order Order UUID
     * @returns any Order details retrieved successfully
     * @throws ApiError
     */
    public static getAdminOrder(
        order: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: Order;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/orders/{order}',
            path: {
                'order': order,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
                404: `Order not found`,
            },
        });
    }
}
