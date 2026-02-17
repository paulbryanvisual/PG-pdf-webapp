/* ===================================================
   Credit System — Pricing & Cost Calculation
   =================================================== */

import { CreditPack } from '@/types';

// --- Credit Packs ---
export const CREDIT_PACKS: CreditPack[] = [
    {
        id: 'starter',
        name: 'Starter',
        credits: 50,
        price_cents: 999,
        stripe_price_id: 'price_starter_50',
    },
    {
        id: 'pro',
        name: 'Pro',
        credits: 250,
        price_cents: 3999,
        stripe_price_id: 'price_pro_250',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 1000,
        price_cents: 12999,
        stripe_price_id: 'price_enterprise_1000',
    },
];

// --- Cost Calculation ---
export function calculateCreditCost(pageCount: number, hasImages: boolean): number {
    let cost = 1; // base cost

    if (pageCount > 5 && pageCount <= 20) {
        cost = 2;
    } else if (pageCount > 20 && pageCount <= 50) {
        cost = 3;
    } else if (pageCount > 50) {
        cost = 5;
    }

    // Image-heavy PDFs cost more (vision AI calls)
    if (hasImages) {
        cost += 1;
    }

    return cost;
}

// --- Formatting ---
export function formatCredits(credits: number): string {
    return credits.toLocaleString();
}

export function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

export function pricePerCredit(pack: CreditPack): string {
    return `$${(pack.price_cents / 100 / pack.credits).toFixed(2)}`;
}
