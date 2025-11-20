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
export class PhotosService {
    /**
     * Lister toutes les photos
     * Récupérer une liste paginée de toutes les photos approuvées et publiques
     * @param perPage Nombre de photos par page
     * @param page Numéro de page
     * @returns any Liste des photos récupérée avec succès
     * @throws ApiError
     */
    public static indexPhotos(
        perPage: number = 20,
        page: number = 1,
    ): CancelablePromise<{
        data?: Array<Photo>;
        meta?: PaginationMeta;
        links?: PaginationLinks;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos',
            query: {
                'per_page': perPage,
                'page': page,
            },
        });
    }
    /**
     * Afficher une photo spécifique
     * Récupérer les détails complets d'une photo par son ID
     * @param photo ID de la photo (UUID)
     * @returns any Photo trouvée
     * @throws ApiError
     */
    public static showPhoto(
        photo: string,
    ): CancelablePromise<{
        data?: Photo;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos/{photo}',
            path: {
                'photo': photo,
            },
            errors: {
                403: `Accès non autorisé (photo non publique)`,
                404: `Photo non trouvée`,
            },
        });
    }
    /**
     * Lister les photos mises en avant
     * Récupérer les photos sélectionnées comme 'featured' par les administrateurs
     * @param perPage Nombre de photos par page
     * @returns any Photos featured récupérées
     * @throws ApiError
     */
    public static featuredPhotos(
        perPage: number = 10,
    ): CancelablePromise<{
        data?: Array<Photo>;
        meta?: PaginationMeta;
        links?: PaginationLinks;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos/featured',
            query: {
                'per_page': perPage,
            },
        });
    }
    /**
     * Lister les photos récentes
     * Récupérer les photos les plus récemment ajoutées
     * @param limit Nombre maximum de photos à retourner
     * @returns any Photos récentes récupérées
     * @throws ApiError
     */
    public static recentPhotos(
        limit: number = 12,
    ): CancelablePromise<{
        data?: Array<Photo>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos/recent',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Lister les photos populaires
     * Récupérer les photos les plus populaires (par vues et ventes)
     * @param limit Nombre maximum de photos à retourner
     * @returns any Photos populaires récupérées
     * @throws ApiError
     */
    public static popularPhotos(
        limit: number = 12,
    ): CancelablePromise<{
        data?: Array<Photo>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos/popular',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Trouver des photos similaires
     * Récupérer des photos similaires basées sur la catégorie et le photographe
     * @param photo ID de la photo de référence (UUID)
     * @param limit Nombre maximum de photos similaires à retourner
     * @returns any Photos similaires trouvées
     * @throws ApiError
     */
    public static similarPhotos(
        photo: string,
        limit: number = 6,
    ): CancelablePromise<{
        data?: Array<Photo>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos/{photo}/similar',
            path: {
                'photo': photo,
            },
            query: {
                'limit': limit,
            },
            errors: {
                404: `Photo de référence non trouvée`,
            },
        });
    }
    /**
     * Enregistrer une vue de photo
     * Incrémenter le compteur de vues d'une photo lorsqu'un utilisateur la consulte
     * @param photo ID de la photo (UUID)
     * @returns any Vue enregistrée avec succès
     * @throws ApiError
     */
    public static trackPhotoView(
        photo: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            photo_id?: string;
            views_count?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/photos/{photo}/view',
            path: {
                'photo': photo,
            },
            errors: {
                404: `Photo non trouvée`,
            },
        });
    }
}
