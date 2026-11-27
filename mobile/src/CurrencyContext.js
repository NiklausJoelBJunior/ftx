import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './services/api';

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'GBP', name: 'Pound Sterling' },
  { code: 'AOA', name: 'Angolan Kwanza' },
  { code: 'BIF', name: 'Burundian Franc' },
  { code: 'BWP', name: 'Botswana Pula' },
  { code: 'CDF', name: 'Congolese Franc' },
  { code: 'DJF', name: 'Djiboutian Franc' },
  { code: 'ERN', name: 'Eritrean Nakfa' },
  { code: 'ETB', name: 'Ethiopian Birr' },
  { code: 'EUR', name: 'Euro' },
  { code: 'KES', name: 'Kenyan Shilling' },
  { code: 'KMF', name: 'Comorian Franc' },
  { code: 'LSL', name: 'Lesotho Loti' },
  { code: 'MGA', name: 'Malagasy Ariary' },
  { code: 'MUR', name: 'Mauritian Rupee' },
  { code: 'MWK', name: 'Malawian Kwacha' },
  { code: 'MZN', name: 'Mozambican Metical' },
  { code: 'NAD', name: 'Namibian Dollar' },
  { code: 'RWF', name: 'Rwandan Franc' },
  { code: 'SCR', name: 'Seychellois Rupee' },
  { code: 'SOS', name: 'Somali Shilling' },
  { code: 'SSP', name: 'South Sudanese Pound' },
  { code: 'SZL', name: 'Eswatini Lilangeni' },
  { code: 'TZS', name: 'Tanzanian Shilling' },
  { code: 'UGX', name: 'Ugandan Shilling' },
  { code: 'ZAR', name: 'South African Rand' },
  { code: 'ZMW', name: 'Zambian Kwacha' },
  { code: 'ZWG', name: 'Zimbabwe Gold' },
];

const CurrencyContext = createContext(null);
const CURRENCY_KEY = '@ftx_currency';
const RATES_KEY = '@ftx_usd_exchange_rates';

function isValidRates(rates) {
  return rates && typeof rates === 'object' && Number.isFinite(rates.USD) && rates.USD === 1;
}

async function fetchProviderRates() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD', { signal: controller.signal });
    if (!response.ok) throw new Error(`Exchange-rate provider returned ${response.status}`);
    const data = await response.json();
    if (data.result !== 'success' || data.base_code !== 'USD' || !isValidRates(data.rates)) {
      throw new Error('Exchange-rate provider returned invalid data');
    }
    return {
      rates: data.rates,
      updatedAt: data.time_last_update_utc || null,
      stale: false,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchExchangeRates() {
  let providerError;
  try {
    return await fetchProviderRates();
  } catch (error) {
    providerError = error;
  }

  try {
    const response = await api('/exchange-rates');
    if (!isValidRates(response.rates)) throw new Error('The server returned invalid exchange rates');
    return response;
  } catch (error) {
    throw new Error(`Direct exchange-rate lookup failed: ${providerError.message}. API fallback failed: ${error.message}`);
  }
}

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({ USD: 1 });
  const [ratesStatus, setRatesStatus] = useState('loading');
  const [ratesError, setRatesError] = useState(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);

  useEffect(() => {
    let active = true;
    let savedCurrency = 'USD';
    let cachedRates = null;
    let cachedUpdatedAt = null;

    const loadRates = async () => {
      try {
        const [saved, cached] = await Promise.all([
          AsyncStorage.getItem(CURRENCY_KEY),
          AsyncStorage.getItem(RATES_KEY),
        ]);
        if (CURRENCIES.some(item => item.code === saved)) savedCurrency = saved;
        if (cached) {
          const parsed = JSON.parse(cached);
          if (isValidRates(parsed.rates)) {
            cachedRates = parsed.rates;
            cachedUpdatedAt = parsed.updatedAt || null;
          }
        }
      } catch (error) {
        if (active) setRatesError(`Could not load saved currency settings: ${error.message}`);
      }

      if (active && cachedRates) {
        setRates(cachedRates);
        if (cachedRates[savedCurrency]) setCurrency(savedCurrency);
        setRatesUpdatedAt(cachedUpdatedAt);
      }

      try {
        const response = await fetchExchangeRates();
        if (!active) return;

        setRates(response.rates);
        if (response.rates[savedCurrency]) {
          setCurrency(savedCurrency);
        } else if (savedCurrency !== 'USD') {
          setCurrency('USD');
          setRatesError(`A rate for ${savedCurrency} is unavailable. Showing prices in USD.`);
        }
        setRatesUpdatedAt(response.updatedAt || null);
        setRatesStatus(response.stale ? 'stale' : 'ready');
        if (response.stale) {
          setRatesError('The server is using cached exchange rates.');
        } else if (response.rates[savedCurrency]) {
          setRatesError(null);
        }
        try {
          await AsyncStorage.setItem(RATES_KEY, JSON.stringify({
            rates: response.rates,
            updatedAt: response.updatedAt || null,
          }));
        } catch (error) {
          setRatesError(`Exchange rates loaded, but could not save them on this device: ${error.message}`);
        }
      } catch (error) {
        if (!active) return;
        if (cachedRates) {
          setRatesStatus('stale');
          setRatesError(`Could not refresh exchange rates. Using saved rates${cachedUpdatedAt ? ` from ${cachedUpdatedAt}` : ''}.`);
        } else {
          setRatesStatus('error');
          setRatesError(`Exchange rates are unavailable. Prices will remain in USD. ${error.message}`);
        }
      }
    };

    loadRates();
    return () => { active = false; };
  }, []);

  const selectCurrency = useCallback(async code => {
    if (!CURRENCIES.some(item => item.code === code)) throw new Error('Choose a supported currency');
    if (!Number.isFinite(rates[code]) || rates[code] <= 0) {
      throw new Error(`The exchange rate for ${code} is unavailable`);
    }
    await AsyncStorage.setItem(CURRENCY_KEY, code);
    setCurrency(code);
    setRatesError(ratesStatus === 'stale' ? 'The server is using cached exchange rates.' : null);
  }, [rates, ratesStatus]);

  const formatAmount = useCallback(amount => {
    const value = Number(amount);
    const rate = rates[currency];
    if (!Number.isFinite(value) || !Number.isFinite(rate)) return '—';
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value * rate);
  }, [currency, rates]);

  const convertToUsd = useCallback(amount => {
    const value = Number(amount);
    const rate = rates[currency];
    if (!Number.isFinite(value) || value <= 0) throw new Error('Enter a valid asking price');
    if (!Number.isFinite(rate) || rate <= 0) throw new Error(`The exchange rate for ${currency} is unavailable`);
    return Number((value / rate).toFixed(2));
  }, [currency, rates]);

  const value = useMemo(() => ({
    currency,
    currencies: CURRENCIES,
    ratesStatus,
    ratesError,
    ratesUpdatedAt,
    formatAmount,
    convertToUsd,
    selectCurrency,
  }), [currency, ratesStatus, ratesError, ratesUpdatedAt, formatAmount, convertToUsd, selectCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
}
