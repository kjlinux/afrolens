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
export class OrdersService {
    /**
     * List user's orders
     * Get all orders for the authenticated user with pagination
     * @param perPage Number of orders per page
     * @returns any Orders retrieved successfully
     * @throws ApiError
     */
    public static getOrders(
        perPage: number = 20,
    ): CancelablePromise<{
        data?: Array<Order>;
        meta?: PaginationMeta;
        links?: PaginationLinks;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders',
            query: {
                'per_page': perPage,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Create new order
     * Create a new order with items from cart. Platform takes 20% commission.
     * @param requestBody
     * @returns any Order created successfully
     * @throws ApiError
     */
    public static storeOrders(
        requestBody: {
            items: Array<{
                photo_id?: string;
                license_type?: 'standard' | 'extended';
            }>;
            /**
             * Sum of all item prices in FCFA
             */
            subtotal: number;
            /**
             * Tax amount (currently 0)
             */
            tax?: number;
            /**
             * Discount amount
             */
            discount?: number;
            /**
             * Total amount in FCFA
             */
            total: number;
            payment_method: 'mobile_money' | 'card';
            billing_email: string;
            billing_first_name: string;
            billing_last_name: string;
            /**
             * Burkinabé phone format
             */
            billing_phone: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Order;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Order creation failed - photo unavailable or validation error`,
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get order details
     * Retrieve detailed information about a specific order (must be order owner)
     * @param order Order UUID
     * @returns Order Order details retrieved successfully
     * @throws ApiError
     */
    public static getOrder(
        order: string,
    ): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/{order}',
            path: {
                'order': order,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - user is not order owner`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Initiate payment for order
     * Start payment process via CinetPay (Mobile Money or Card). Returns payment URL to redirect user.
     * @param order Order UUID
     * @param requestBody
     * @returns any Payment initiated successfully
     * @throws ApiError
     */
    public static payOrders(
        order: string,
        requestBody: {
            /**
             * Payment method type
             */
            payment_method: 'mobile_money' | 'card';
            /**
             * CinetPay payment provider code
             */
            payment_provider: 'FLOOZ' | 'TMONEY' | 'MOOV' | 'CARD';
            /**
             * Phone number for mobile money (required for mobile_money)
             */
            phone?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            /**
             * URL to redirect user for payment
             */
            payment_url?: string;
            /**
             * CinetPay payment token
             */
            payment_token?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/{order}/pay',
            path: {
                'order': order,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Payment initiation failed - order already processed or payment error`,
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Check order payment status
     * Check the current payment status of an order with CinetPay (must be order owner)
     * @param order Order UUID
     * @returns any Payment status retrieved successfully
     * @throws ApiError
     */
    public static getOrdersStatus(
        order: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            payment_status?: 'pending' | 'completed' | 'failed' | 'cancelled';
            order_status?: string;
            transaction_id?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/{order}/status',
            path: {
                'order': order,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - user is not order owner`,
            },
        });
    }
}
