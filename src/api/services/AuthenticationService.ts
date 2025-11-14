/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Créer un nouveau compte utilisateur
     * Permet à un nouvel utilisateur de s'inscrire sur la plateforme en tant qu'acheteur ou photographe
     * @param requestBody Données d'inscription
     * @returns any Inscription réussie
     * @throws ApiError
     */
    public static register(
        requestBody: {
            /**
             * Prénom de l'utilisateur
             */
            first_name: string;
            /**
             * Nom de l'utilisateur
             */
            last_name: string;
            /**
             * Adresse email (doit être unique)
             */
            email: string;
            /**
             * Mot de passe (minimum 8 caractères, doit contenir lettres, chiffres et symboles)
             */
            password: string;
            /**
             * Confirmation du mot de passe
             */
            password_confirmation: string;
            /**
             * Type de compte (buyer=acheteur, photographer=photographe)
             */
            account_type: 'buyer' | 'photographer';
            /**
             * Numéro de téléphone (format burkinabè optionnel)
             */
            phone?: string | null;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            user?: User;
            access_token?: string;
            token_type?: string;
            expires_in?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Erreur de validation`,
                500: `Erreur serveur`,
            },
        });
    }
    /**
     * Se connecter à un compte existant
     * Authentifier un utilisateur et recevoir un token JWT pour les requêtes suivantes
     * @param requestBody Identifiants de connexion
     * @returns any Connexion réussie
     * @throws ApiError
     */
    public static login(
        requestBody: {
            /**
             * Adresse email du compte
             */
            email: string;
            /**
             * Mot de passe du compte
             */
            password: string;
            /**
             * Maintenir la session active plus longtemps
             */
            remember_me?: boolean;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            user?: User;
            access_token?: string;
            token_type?: string;
            expires_in?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Identifiants invalides`,
                422: `Erreur de validation`,
            },
        });
    }
    /**
     * Se déconnecter
     * Invalider le token JWT actuel de l'utilisateur
     * @returns any Déconnexion réussie
     * @throws ApiError
     */
    public static logout(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
            errors: {
                401: `Non authentifié`,
                500: `Erreur serveur`,
            },
        });
    }
    /**
     * Rafraîchir le token JWT
     * Obtenir un nouveau token JWT en utilisant le token actuel (avant qu'il n'expire)
     * @returns any Token rafraîchi avec succès
     * @throws ApiError
     */
    public static refreshToken(): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            access_token?: string;
            token_type?: string;
            expires_in?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
            errors: {
                401: `Token invalide ou expiré`,
            },
        });
    }
    /**
     * Obtenir les informations de l'utilisateur connecté
     * Récupérer le profil complet de l'utilisateur actuellement authentifié
     * @returns any Informations utilisateur récupérées
     * @throws ApiError
     */
    public static me(): CancelablePromise<{
        success?: boolean;
        data?: User;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
            errors: {
                401: `Non authentifié`,
                500: `Erreur serveur`,
            },
        });
    }
}
