/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from './Category';
import type { PhotographerProfile } from './PhotographerProfile';
/**
 * Modèle photo complet
 */
export type Photo = {
    id?: string;
    title?: string;
    description?: string | null;
    slug?: string;
    tags?: Array<string>;
    preview_url?: string;
    thumbnail_url?: string;
    watermarked_url?: string;
    width?: number;
    height?: number;
    /**
     * Taille en octets
     */
    file_size?: number;
    format?: string;
    exif_data?: Record<string, any> | null;
    color_palette?: Array<string>;
    location?: string | null;
    /**
     * Prix en FCFA
     */
    price_standard?: number;
    /**
     * Prix en FCFA
     */
    price_extended?: number;
    status?: Photo.status;
    views_count?: number;
    downloads_count?: number;
    favorites_count?: number;
    is_featured?: boolean;
    category_id?: string;
    photographer_id?: string;
    photographer?: PhotographerProfile;
    category?: Category;
    created_at?: string;
    updated_at?: string;
};
export namespace Photo {
    export enum status {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

