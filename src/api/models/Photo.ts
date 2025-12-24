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
    /**
     * URL signée S3 pour l'image originale (haute résolution)
     */
    original_url?: string;
    /**
     * URL signée S3 pour la preview (résolution moyenne)
     */
    preview_url?: string;
    /**
     * URL signée S3 pour la miniature
     */
    thumbnail_url?: string;
    watermarked_url?: string;
    width?: number;
    height?: number;
    /**
     * Taille en octets
     */
    file_size?: number;
    format?: string;
    /**
     * Données EXIF brutes (optionnel)
     */
    exif_data?: Record<string, any> | null;
    /**
     * Modèle d'appareil photo
     */
    camera?: string | null;
    /**
     * Objectif utilisé
     */
    lens?: string | null;
    /**
     * Sensibilité ISO
     */
    iso?: number | null;
    /**
     * Ouverture (f-stop)
     */
    aperture?: string | null;
    /**
     * Vitesse d'obturation
     */
    shutter_speed?: string | null;
    /**
     * Longueur focale en mm
     */
    focal_length?: string | null;
    /**
     * Date de prise de vue
     */
    taken_at?: string | null;
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
    /**
     * Raison du rejet (si rejetée)
     */
    rejection_reason?: string | null;
    /**
     * Date de modération
     */
    moderated_at?: string | null;
    /**
     * ID du modérateur
     */
    moderated_by?: string | null;
    views_count?: number;
    downloads_count?: number;
    favorites_count?: number;
    sales_count?: number;
    is_featured?: boolean;
    /**
     * Photo mise en avant
     */
    featured?: boolean;
    /**
     * Date de fin de mise en avant
     */
    featured_until?: string | null;
    /**
     * Visibilité publique
     */
    is_public?: boolean;
    category_id?: string;
    photographer_id?: string;
    photographer?: PhotographerProfile;
    category?: Category;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
};
export namespace Photo {
    export enum status {
        PENDING = 'pending',
        APPROVED = 'approved',
        REJECTED = 'rejected',
    }
}

