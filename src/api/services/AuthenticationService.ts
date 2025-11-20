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
    /**
     * Obtenir les capacités de l'utilisateur connecté
     * Récupérer les rôles, permissions et drapeaux de capacité pour l'utilisateur authentifié (utile pour le frontend)
     * @returns any Capacités utilisateur récupérées
     * @throws ApiError
     */
    public static abilities(): CancelablePromise<{
        success?: boolean;
        data?: {
            /**
             * Type de compte
             */
            account_type?: string;
            /**
             * Liste des rôles assignés
             */
            roles?: Array<string>;
            /**
             * Liste des permissions assignées
             */
            permissions?: Array<string>;
            /**
             * Statut du profil photographe (pending, approved, rejected, suspended)
             */
            photographer_status?: string | null;
            /**
             * Peut uploader des photos
             */
            can_upload_photos?: boolean;
            /**
             * Peut modérer du contenu
             */
            can_moderate?: boolean;
            /**
             * Peut gérer les utilisateurs
             */
            can_manage_users?: boolean;
            /**
             * Email vérifié
             */
            is_verified?: boolean;
            /**
             * Compte actif
             */
            is_active?: boolean;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/abilities',
            errors: {
                401: `Non authentifié`,
            },
        });
    }
    /**
     * Demander la réinitialisation du mot de passe
     * Envoie un email avec un lien de réinitialisation de mot de passe. Limité à 3 requêtes par 15 minutes par email.
     * @param requestBody
     * @returns any Email de réinitialisation envoyé
     * @throws ApiError
     */
    public static forgotPassword(
        requestBody: {
            email: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Erreur de validation`,
                429: `Trop de requêtes`,
            },
        });
    }
    /**
     * Réinitialiser le mot de passe
     * Finalise la réinitialisation du mot de passe avec le token reçu par email. Le token est valide pendant 60 minutes.
     * @param requestBody
     * @returns any Mot de passe réinitialisé avec succès
     * @throws ApiError
     */
    public static resetPassword(
        requestBody: {
            token: string;
            email: string;
            password: string;
            password_confirmation: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Token invalide ou expiré`,
                422: `Erreur de validation`,
            },
        });
    }
}
