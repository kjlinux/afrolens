/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Photo } from './Photo';
/**
 * Article d'une commande
 */
export type OrderItem = {
    id?: string;
    photo_id?: string;
    license_type?: OrderItem.license_type;
    price?: number;
    photo?: Photo;
};
export namespace OrderItem {
    export enum license_type {
        STANDARD = 'standard',
        EXTENDED = 'extended',
    }
}

