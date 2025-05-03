// ISO 4217 currency codes and their locales
export const CURRENCY_CONFIG = {
    EUR: { locale: 'de-DE', symbol: '€', position: 'end' },
    USD: { locale: 'en-US', symbol: '$', position: 'start' },
    GBP: { locale: 'en-GB', symbol: '£', position: 'start' },
    CHF: { locale: 'de-CH', symbol: 'CHF', position: 'end' },
    UAH: { locale: 'uk-UA', symbol: '₴', position: 'end' },
    HUF: { locale: 'hu-HU', symbol: 'Ft', position: 'end' }
} as const;

export type Currency = keyof typeof CURRENCY_CONFIG;

export function isValidCurrency(currency: string): currency is Currency {
    return currency in CURRENCY_CONFIG;
}

export function getDefaultCurrency(): Currency {
    return 'EUR';
}

export function formatPrice(price: number | null, currency: string = 'EUR'): string {
    if (price === null) return '';

    if (!isValidCurrency(currency)) {
        console.warn(`Invalid currency: ${currency}, falling back to EUR`);
        currency = 'EUR';
    }

    const currencyKey = currency as Currency;
    const config = CURRENCY_CONFIG[currencyKey];

    const numberFormat = new Intl.NumberFormat(config.locale, {
        minimumFractionDigits: currency === 'HUF' ? 0 : 2,
        maximumFractionDigits: currency === 'HUF' ? 0 : 2
    });

    const formattedNumber = numberFormat.format(price);

    return config.position === 'start'
        ? `${config.symbol}${formattedNumber}`
        : `${formattedNumber}${config.symbol}`;
}

export function getCurrencySymbol(currency: string): string {
    if (!isValidCurrency(currency)) {
        console.warn(`Invalid currency: ${currency}, falling back to EUR`);
        currency = 'EUR';
    }
    return CURRENCY_CONFIG[currency as Currency].symbol;
}

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCY_CONFIG) as Currency[];
