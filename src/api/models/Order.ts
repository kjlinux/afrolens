/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
/**
 * Commande complète
 */
export type Order = {
    id?: string;
    order_number?: string;
    user_id?: string;
    subtotal?: number;
    /**
     * 20% de commission
     */
    commission?: number;
    total?: number;
    payment_status?: Order.payment_status;
    payment_method?: string | null;
    transaction_id?: string | null;
    invoice_number?: string | null;
    invoice_date?: string | null;
    invoice_path?: string | null;
    items?: Array<OrderItem>;
    created_at?: string;
    updated_at?: string;
};
export namespace Order {
    export enum payment_status {
        PENDING = 'pending',
        COMPLETED = 'completed',
        FAILED = 'failed',
        REFUNDED = 'refunded',
    }
}

