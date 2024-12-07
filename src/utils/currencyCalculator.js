// Function to evaluate arithmetic expressions
export const evaluateExpression = (expression) => {
  try {
    // Remove all spaces and validate characters
    const sanitizedExpression = expression.replace(/\s+/g, '').match(/^[0-9+\-*/().]+$/);
    if (!sanitizedExpression) {
      throw new Error('Invalid characters in expression');
    }

    // Use Function constructor to evaluate the expression
    // This is safer than eval() as it only processes mathematical operations
    return new Function(`return ${sanitizedExpression[0]}`)();
  } catch (error) {
    console.error('Error evaluating expression:', error);
    return null;
  }
};

// Function to format currency with proper separators
export const formatCurrency = (amount, currency = 'DKK') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency} 0.00`;
  }

  const formatter = new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
};

// Exchange rates (to be updated with real API)
const exchangeRates = {
  DKK: 1,
  EUR: 0.13,
  USD: 0.14,
  GBP: 0.12,
};

// Function to convert between currencies
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount || !fromCurrency || !toCurrency) {
    return 0;
  }

  // Convert to DKK first (base currency)
  const amountInDKK = fromCurrency === 'DKK' 
    ? amount 
    : amount / exchangeRates[fromCurrency];

  // Convert from DKK to target currency
  return toCurrency === 'DKK' 
    ? amountInDKK 
    : amountInDKK * exchangeRates[toCurrency];
};
