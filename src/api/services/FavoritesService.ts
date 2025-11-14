/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FavoritesService {
    /**
     * Get user's favorite photos
     * Retrieve all photos marked as favorite by the authenticated user with pagination (20 per page)
     * @param page Page number for pagination
     * @returns any Favorites retrieved successfully
     * @throws ApiError
     */
    public static b1Fff6F302Cbd7A85627321A82(
        page: number = 1,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            data?: Array<{
                id?: string;
                title?: string;
                description?: string | null;
                thumbnail_url?: string;
                watermark_url?: string;
                price_standard?: number;
                price_extended?: number;
                photographer?: {
                    id?: string;
                    first_name?: string;
                    last_name?: string;
                };
            }>;
            current_page?: number;
            per_page?: number;
            total?: number;
            last_page?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/favorites',
            query: {
                'page': page,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Add photo to favorites
     * Mark a photo as favorite for the authenticated user
     * @param photo Photo UUID to add to favorites
     * @returns any Photo added to favorites successfully
     * @throws ApiError
     */
    public static b7E953A0D3B5A08B6916B0Cc2328Ecb7(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/favorites/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                400: `Photo already in favorites`,
                401: `Unauthorized - Authentication required`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Remove photo from favorites
     * Unmark a photo as favorite for the authenticated user
     * @param photo Photo UUID to remove from favorites
     * @returns any Photo removed from favorites successfully
     * @throws ApiError
     */
    public static ef4F9124F7C756D2D3697Fabf4F2(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/favorites/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                404: `Resource not found`,
            },
        });
    }
}
