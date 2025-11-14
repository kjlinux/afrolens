/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
    /**
     * Get user's shopping cart
     * Retrieve all items in the current user's shopping cart with totals
     * @returns any Cart retrieved successfully
     * @throws ApiError
     */
    public static fdb9B40Bd4Ad2Baf12Aa15164Eab788(): CancelablePromise<{
        success?: boolean;
        data?: {
            items?: Array<{
                photo_id?: string;
                photo_title?: string;
                photo_thumbnail?: string;
                photographer_id?: string;
                photographer_name?: string;
                license_type?: 'standard' | 'extended';
                price?: number;
            }>;
            subtotal?: number;
            total?: number;
            items_count?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/cart',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Clear entire cart
     * Remove all items from the shopping cart
     * @returns any Cart cleared successfully
     * @throws ApiError
     */
    public static c37760F7C1C679D2A0C391E6A666105(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cart',
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Add item to cart
     * Add a photo with specified license type to the shopping cart
     * @param requestBody
     * @returns any Item added to cart successfully
     * @throws ApiError
     */
    public static c1Ea70Dfbb034F059570D0Ab4A0(
        requestBody: {
            /**
             * UUID of the photo
             */
            photo_id: string;
            /**
             * License type for the photo
             */
            license_type: 'standard' | 'extended';
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            subtotal?: number;
            total?: number;
            items_count?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/cart/items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Photo not available or already in cart`,
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Update cart item
     * Update the license type of a cart item by its index
     * @param index Index of the cart item (0-based)
     * @param requestBody
     * @returns any Cart item updated successfully
     * @throws ApiError
     */
    public static dbda638A0Efc2D64E70Dfd4F01F6979(
        index: number,
        requestBody: {
            /**
             * New license type for the photo
             */
            license_type: 'standard' | 'extended';
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            subtotal?: number;
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/cart/items/{index}',
            path: {
                'index': index,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Authentication required`,
                404: `Cart item not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Remove item from cart
     * Remove a cart item by its index
     * @param index Index of the cart item to remove (0-based)
     * @returns any Item removed from cart successfully
     * @throws ApiError
     */
    public static eb273E1375182A67Df9E585D2222B15F(
        index: number,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            subtotal?: number;
            total?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cart/items/{index}',
            path: {
                'index': index,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                404: `Cart item not found`,
            },
        });
    }
}
