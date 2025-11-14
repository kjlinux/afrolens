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
export class SearchService {
    /**
     * Rechercher des photos
     * Recherche avancée de photos avec filtres multiples (mots-clés, catégorie, prix, orientation, etc.)
     * @param query Terme de recherche (recherche dans titre, description et tags)
     * @param categories IDs des catégories (séparés par virgule)
     * @param photographerId ID du photographe
     * @param minPrice Prix minimum en FCFA
     * @param maxPrice Prix maximum en FCFA
     * @param orientation Orientation de la photo
     * @param sortBy Critère de tri
     * @param perPage Nombre de résultats par page
     * @returns any Résultats de recherche
     * @throws ApiError
     */
    public static searchPhotos(
        query?: string,
        categories?: Array<string>,
        photographerId?: string,
        minPrice?: number,
        maxPrice?: number,
        orientation?: 'landscape' | 'portrait' | 'square',
        sortBy: 'date' | 'popularity' | 'price_asc' | 'price_desc' = 'date',
        perPage: number = 20,
    ): CancelablePromise<{
        data?: Array<Photo>;
        meta?: PaginationMeta;
        links?: PaginationLinks;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/search/photos',
            query: {
                'query': query,
                'categories': categories,
                'photographer_id': photographerId,
                'min_price': minPrice,
                'max_price': maxPrice,
                'orientation': orientation,
                'sort_by': sortBy,
                'per_page': perPage,
            },
            errors: {
                422: `Erreur de validation`,
            },
        });
    }
}
