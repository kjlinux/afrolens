/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * Lister toutes les catégories
     * Récupérer toutes les catégories actives avec leurs sous-catégories
     * @returns any Liste des catégories récupérée
     * @throws ApiError
     */
    public static indexCategories(): CancelablePromise<{
        data?: Array<Category>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories',
        });
    }
    /**
     * Afficher une catégorie spécifique
     * Récupérer une catégorie par son slug ou son ID
     * @param slugOrId Slug ou ID (UUID) de la catégorie
     * @returns any Catégorie trouvée
     * @throws ApiError
     */
    public static showCategory(
        slugOrId: string,
    ): CancelablePromise<{
        data?: Category;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories/{slugOrId}',
            path: {
                'slugOrId': slugOrId,
            },
            errors: {
                404: `Catégorie non trouvée`,
            },
        });
    }
}
