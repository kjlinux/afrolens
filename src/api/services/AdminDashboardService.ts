/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminDashboardService {
    /**
     * Get admin dashboard statistics
     * Retrieve comprehensive platform statistics including users, photos, orders, withdrawals, recent activity, and platform health metrics. Requires admin role.
     * @returns any Dashboard statistics retrieved successfully
     * @throws ApiError
     */
    public static f6E3Ffeb3C9Fb988Ca2A77Ad48E2C04C(): CancelablePromise<{
        success?: boolean;
        data?: {
            users?: {
                total?: number;
                buyers?: number;
                photographers?: number;
                admins?: number;
                verified?: number;
                new_this_month?: number;
            };
            photos?: {
                total?: number;
                pending?: number;
                approved?: number;
                rejected?: number;
                featured?: number;
                uploaded_this_month?: number;
            };
            orders?: {
                total?: number;
                pending?: number;
                completed?: number;
                failed?: number;
                total_revenue?: number;
                orders_this_month?: number;
                revenue_this_month?: number;
            };
            withdrawals?: {
                total?: number;
                pending?: number;
                approved?: number;
                rejected?: number;
                total_amount?: number;
                pending_amount?: number;
            };
            recent_activity?: {
                latest_orders?: Array<Record<string, any>>;
                latest_photos?: Array<Record<string, any>>;
                latest_users?: Array<Record<string, any>>;
            };
            platform?: {
                active_photographers?: number;
                average_photo_price?: number;
                conversion_rate?: number;
                top_photographers?: Array<Record<string, any>>;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/dashboard',
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Admin role required`,
            },
        });
    }
}
