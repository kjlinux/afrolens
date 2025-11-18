/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WebhooksService {
    /**
     * CinetPay payment webhook (callback)
     * Receives payment notifications from CinetPay when payment status changes. Uses HMAC signature verification for security. This endpoint is called by CinetPay servers only.
     * @param requestBody CinetPay webhook payload
     * @returns any Webhook processed successfully
     * @throws ApiError
     */
    public static storeWebhooksCinetpay(
        requestBody: {
            /**
             * CinetPay transaction ID
             */
            cpm_trans_id?: string;
            /**
             * Order number (custom field)
             */
            cpm_custom?: string;
            /**
             * Payment amount in FCFA
             */
            cpm_amount?: number;
            /**
             * Payment result code ('00' = success)
             */
            cpm_result?: string;
            /**
             * HMAC signature = sha256(site_id + order_number + api_key)
             */
            signature?: string;
            /**
             * Payment provider used
             */
            payment_method?: string;
        },
    ): CancelablePromise<{
        status?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/webhooks/cinetpay',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid signature`,
                404: `Order not found`,
            },
        });
    }
    /**
     * CinetPay payment return URL
     * User is redirected here after completing payment on CinetPay. Checks payment status and redirects to frontend success/failure page.
     * @param order Order UUID
     * @returns void
     * @throws ApiError
     */
    public static getWebhooksCinetpayReturn(
        order: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/webhooks/cinetpay/return/{order}',
            path: {
                'order': order,
            },
            errors: {
                302: `Redirect to frontend success or failure page`,
                404: `Resource not found`,
            },
        });
    }
}
