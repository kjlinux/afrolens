/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle utilisateur
 */
export type User = {
    id?: string;
    name?: string;
    email?: string;
    account_type?: User.account_type;
    profile_picture?: string | null;
    created_at?: string;
    updated_at?: string;
};
export namespace User {
    export enum account_type {
        USER = 'user',
        PHOTOGRAPHER = 'photographer',
        ADMIN = 'admin',
    }
}

