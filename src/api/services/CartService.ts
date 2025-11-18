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
     * Retrieve all items in the current user's shopping cart with totals. Works for both authenticated and guest users.
     * @param cartSessionId Session ID for guest cart (optional, generated automatically if not provided)
     * @returns any Cart retrieved successfully
     * @throws ApiError
     */
    public static getCart(
        cartSessionId?: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            items?: Array<{
                id?: string;
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
            /**
             * Session ID for guest cart
             */
            cart_session_id?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/cart',
            query: {
                'cart_session_id': cartSessionId,
            },
        });
    }
    /**
     * Clear entire cart
     * Remove all items from the shopping cart
     * @param cartSessionId Session ID for guest cart (optional)
     * @returns any Cart cleared successfully
     * @throws ApiError
     */
    public static clearCart(
        cartSessionId?: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cart',
            query: {
                'cart_session_id': cartSessionId,
            },
        });
    }
    /**
     * Add item to cart
     * Add a photo with specified license type to the shopping cart. Works for both authenticated and guest users.
     * @param requestBody
     * @returns any Item added to cart successfully
     * @throws ApiError
     */
    public static addCartItem(
        requestBody: {
            /**
             * UUID of the photo
             */
            photo_id: string;
            /**
             * License type for the photo
             */
            license_type: 'standard' | 'extended';
            /**
             * Session ID for guest cart (optional)
             */
            cart_session_id?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            items?: Array<Record<string, any>>;
            subtotal?: number;
            total?: number;
            items_count?: number;
            /**
             * Session ID for guest cart
             */
            cart_session_id?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/cart/items',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Photo not available or already in cart`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Update cart item
     * Update the license type of a cart item by its ID
     * @param item UUID of the cart item
     * @param requestBody
     * @returns any Cart item updated successfully
     * @throws ApiError
     */
    public static updateCartItem(
        item: string,
        requestBody: {
            /**
             * New license type for the photo
             */
            license_type: 'standard' | 'extended';
            /**
             * Session ID for guest cart (optional)
             */
            cart_session_id?: string;
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
            url: '/api/cart/items/{item}',
            path: {
                'item': item,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Cart item not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Remove item from cart
     * Remove a cart item by its ID
     * @param item UUID of the cart item to remove
     * @param cartSessionId Session ID for guest cart (optional)
     * @returns any Item removed from cart successfully
     * @throws ApiError
     */
    public static removeCartItem(
        item: string,
        cartSessionId?: string,
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
            url: '/api/cart/items/{item}',
            path: {
                'item': item,
            },
            query: {
                'cart_session_id': cartSessionId,
            },
            errors: {
                404: `Cart item not found`,
            },
        });
    }
}
