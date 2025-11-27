/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * Ligdicash payment webhook (callback)
     * Receives payment notifications from Ligdicash when payment status changes. This endpoint is called by Ligdicash servers only. Ligdicash sends two POST requests (application/x-www-form-urlencoded and application/json) with the same data.
     * @param requestBody Ligdicash webhook payload
     * @returns any Webhook processed successfully
     * @throws ApiError
     */
    public static storeWebhooksLigdicash(
        requestBody: {
            /**
             * Response code ('00' = success, '01' = error)
             */
            response_code?: string;
            /**
             * Transaction token
             */
            token?: string;
            /**
             * Transaction status (completed, pending, notcompleted)
             */
            status?: string;
            /**
             * Payment amount in FCFA
             */
            amount?: number;
            /**
             * Payment operator name
             */
            operator_name?: string;
            /**
             * Custom data sent in initial request
             */
            custom_data?: {
                order_id?: string;
                order_number?: string;
                user_id?: string;
            };
        },
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/webhooks/ligdicash',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Order not found`,
            },
        });
    }
    /**
     * Ligdicash payment return URL
     * User is redirected here after completing payment on Ligdicash. Checks payment status and redirects to frontend success/failure page.
     * @param order Order UUID
     * @returns void
     * @throws ApiError
     */
    public static getWebhooksLigdicashReturn(
        order: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/webhooks/ligdicash/return/{order}',
            path: {
                'order': order,
            },
            errors: {
                302: `Redirect to frontend success or failure page`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Ligdicash payment cancel URL
     * User is redirected here when cancelling payment on Ligdicash.
     * @param order Order UUID
     * @returns void
     * @throws ApiError
     */
    public static getWebhooksLigdicashCancel(
        order: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/webhooks/ligdicash/cancel/{order}',
            path: {
                'order': order,
            },
            errors: {
                302: `Redirect to frontend cancelled page`,
                404: `Resource not found`,
            },
        });
    }
}
