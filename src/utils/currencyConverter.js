// Exchange rates as of the last update (would be fetched from an API in production)
const EXCHANGE_RATES = {
  DKK: 1, // Base currency
  USD: 0.14,
  EUR: 0.13,
  GBP: 0.12,
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to DKK first if not already in DKK
  const amountInDKK = fromCurrency === 'DKK' 
    ? amount 
    : amount / EXCHANGE_RATES[fromCurrency];
  
  // Convert from DKK to target currency
  return amountInDKK * EXCHANGE_RATES[toCurrency];
};

export const formatCurrency = (amount, currency = 'DKK') => {
  if (!currency) currency = 'DKK';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount || 0);
};

// Function to evaluate arithmetic expressions in input fields
export const evaluateExpression = (expression) => {
  try {
    // Remove all spaces and validate input
    const sanitizedExp = expression.replace(/\s+/g, '');
    if (!/^[0-9+\-*/().]+$/.test(sanitizedExp)) {
      throw new Error('Invalid characters in expression');
    }
    
    // Use Function constructor to evaluate the expression
    // This is safer than eval() as it only processes mathematical operations
    return new Function(`return ${sanitizedExp}`)();
  } catch (error) {
    console.error('Invalid expression:', error);
    return NaN;
  }
};

export const AVAILABLE_CURRENCIES = Object.keys(EXCHANGE_RATES);
