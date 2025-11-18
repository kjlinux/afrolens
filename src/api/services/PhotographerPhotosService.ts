/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginationLinks } from '../models/PaginationLinks';
import type { PaginationMeta } from '../models/PaginationMeta';
import type { Photo } from '../models/Photo';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PhotographerPhotosService {
    /**
     * List photographer's photos
     * Get all photos uploaded by the authenticated photographer with pagination and category details
     * @param perPage Number of photos per page
     * @returns any Photos retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerPhotos(
        perPage: number = 20,
    ): CancelablePromise<{
        data?: Array<Photo>;
        meta?: PaginationMeta;
        links?: PaginationLinks;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/photos',
            query: {
                'per_page': perPage,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
            },
        });
    }
    /**
     * Upload new photos
     * Upload one or multiple photos with metadata. Photos are processed asynchronously. Platform takes 20% commission on all sales.
     * @param formData
     * @returns any Photos uploaded successfully and processing started
     * @throws ApiError
     */
    public static storePhotographerPhotos(
        formData: {
            /**
             * One or more photo files to upload
             */
            'photos[]'?: Array<Blob>;
            /**
             * Category UUID
             */
            category_id: string;
            /**
             * Photo title
             */
            title: string;
            /**
             * Photo description (optional)
             */
            description?: string;
            /**
             * Comma-separated tags
             */
            tags?: string;
            /**
             * Standard license price in FCFA
             */
            price_standard: number;
            /**
             * Extended license price in FCFA
             */
            price_extended: number;
            /**
             * Photo location (optional)
             */
            location?: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Array<Photo>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/photographer/photos',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthorized - Authentication required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get photo details
     * Retrieve detailed information about a specific photo owned by the photographer
     * @param photo Photo UUID
     * @returns Photo Photo details retrieved successfully
     * @throws ApiError
     */
    public static getPhotographerPhoto(
        photo: string,
    ): CancelablePromise<Photo> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photographer/photos/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - user is not the photo owner`,
                404: `Resource not found`,
            },
        });
    }
    /**
     * Update photo
     * Update photo metadata (title, description, tags, pricing, etc.). Only the photo owner can update.
     * @param photo Photo UUID
     * @param requestBody
     * @returns any Photo updated successfully
     * @throws ApiError
     */
    public static updatePhotographerPhotos(
        photo: string,
        requestBody: {
            title?: string;
            description?: string;
            tags?: string;
            category_id?: string;
            /**
             * Standard license price in FCFA
             */
            price_standard?: number;
            /**
             * Extended license price in FCFA
             */
            price_extended?: number;
            location?: string;
            /**
             * Whether photo is public
             */
            is_public?: boolean;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Photo;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/photographer/photos/{photo}',
            path: {
                'photo': photo,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - user is not the photo owner`,
                404: `Resource not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Delete photo
     * Permanently delete a photo. Only the photo owner can delete. Uploaded files on S3 may be preserved based on policy.
     * @param photo Photo UUID
     * @returns any Photo deleted successfully
     * @throws ApiError
     */
    public static deletePhotographerPhotos(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/photographer/photos/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - user is not the photo owner`,
                404: `Resource not found`,
            },
        });
    }
}
