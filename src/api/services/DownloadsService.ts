/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DownloadsService {
    /**
     * Download purchased photo (high-resolution)
     * Download the high-resolution version of a purchased photo. User must have completed order containing this photo.
     * @param photo Photo UUID
     * @returns binary Photo file download (streamed)
     * @throws ApiError
     */
    public static getDownloadsPhoto(
        photo: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/downloads/photo/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - photo not purchased`,
                404: `Photo file not found on server`,
            },
        });
    }
    /**
     * Download all photos from order (ZIP)
     * Download all high-resolution photos from a completed order as a ZIP archive. User must be order owner.
     * @param order Order UUID
     * @returns binary ZIP file download (streamed)
     * @throws ApiError
     */
    public static getDownloadsOrder(
        order: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/downloads/order/{order}',
            path: {
                'order': order,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - order not completed or not owner`,
                404: `No photos found in order`,
                500: `Server error creating ZIP file`,
            },
        });
    }
    /**
     * Download order invoice (PDF)
     * Download the PDF invoice for a completed order. User must be order owner.
     * @param order Order UUID
     * @returns binary PDF invoice download
     * @throws ApiError
     */
    public static getDownloadsInvoice(
        order: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/downloads/invoice/{order}',
            path: {
                'order': order,
            },
            errors: {
                401: `Unauthorized - Authentication required`,
                403: `Forbidden - Insufficient permissions`,
                404: `Invoice not found`,
            },
        });
    }
    /**
     * Download watermarked preview (public)
     * Download a watermarked preview version of any photo. No authentication required. Useful for demos or sharing.
     * @param photo Photo UUID
     * @returns binary Watermarked preview image download
     * @throws ApiError
     */
    public static getDownloadsPreview(
        photo: string,
    ): CancelablePromise<Blob> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/downloads/preview/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                404: `Preview not found`,
            },
        });
    }
}
