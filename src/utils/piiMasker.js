/**
 * PII masking utility for the CSNP Member Portal.
 * Prevents unmasked PII from appearing in logs or debug output.
 * @module piiMasker
 */

/**
 * Set of object keys that are considered PII and should be masked.
 * @type {Set<string>}
 */
const PII_FIELD_NAMES = new Set([
  'name',
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'memberId',
  'ssn',
  'dateOfBirth',
  'dob',
  'deliveryEmail',
]);

/**
 * Map of PII field names to their masking type.
 * @type {Object.<string, string>}
 */
const FIELD_TYPE_MAP = {
  name: 'name',
  firstName: 'name',
  lastName: 'name',
  email: 'email',
  deliveryEmail: 'email',
  phone: 'phone',
  address: 'address',
  memberId: 'memberId',
  ssn: 'memberId',
  dateOfBirth: 'date',
  dob: 'date',
};

/**
 * Masks a single word by keeping the first character and replacing the rest with asterisks.
 * @param {string} word - The word to mask.
 * @returns {string} The masked word.
 */
function maskWord(word) {
  if (!word || word.length === 0) {
    return '***';
  }
  if (word.length === 1) {
    return word + '**';
  }
  return word[0] + '*'.repeat(word.length - 1);
}

/**
 * Masks a PII value based on its type.
 *
 * @param {string} value - The PII value to mask.
 * @param {'name'|'email'|'phone'|'address'|'memberId'|'date'} type - The type of PII.
 * @returns {string} The masked value.
 *
 * @example
 * mask('Jane Doe', 'name');       // 'J*** D**'
 * mask('jane@example.com', 'email'); // 'j***@example.com'
 * mask('(555) 123-4567', 'phone');   // '(***) ***-4567'
 * mask('123 Main St', 'address');    // '*** Main St'
 * mask('MEM123456', 'memberId');     // '*****3456'
 */
export function mask(value, type) {
  if (value === null || value === undefined) {
    return '***';
  }

  const str = String(value);

  if (str.trim().length === 0) {
    return '***';
  }

  switch (type) {
    case 'name': {
      const parts = str.split(' ').filter(Boolean);
      return parts.map((part) => maskWord(part)).join(' ');
    }

    case 'email': {
      const atIndex = str.indexOf('@');
      if (atIndex <= 0) {
        return '***';
      }
      const localPart = str.substring(0, atIndex);
      const domain = str.substring(atIndex + 1);
      return localPart[0] + '***@' + domain;
    }

    case 'phone': {
      const digits = str.replace(/\D/g, '');
      if (digits.length < 4) {
        return '(***) ***-****';
      }
      const lastFour = digits.slice(-4);
      return '(***) ***-' + lastFour;
    }

    case 'address': {
      const words = str.split(' ').filter(Boolean);
      if (words.length <= 1) {
        return '***';
      }
      return '*** ' + words.slice(1).join(' ');
    }

    case 'memberId': {
      if (str.length <= 4) {
        return '****' + str;
      }
      return '*'.repeat(str.length - 4) + str.slice(-4);
    }

    case 'date': {
      if (str.length <= 4) {
        return '****';
      }
      return '****-**-' + str.slice(-2);
    }

    default:
      return '***';
  }
}

/**
 * Infers the masking type for a given field name.
 * @param {string} fieldName - The name of the field.
 * @returns {string|null} The inferred masking type, or null if not a PII field.
 */
function inferType(fieldName) {
  if (!fieldName) {
    return null;
  }
  const lower = fieldName.toLowerCase();
  for (const [key, type] of Object.entries(FIELD_TYPE_MAP)) {
    if (key.toLowerCase() === lower) {
      return type;
    }
  }
  return null;
}

/**
 * Recursively masks all PII fields in an object.
 * Non-PII fields are left unchanged. Arrays are traversed.
 * Primitive values at the top level are returned as-is.
 *
 * @param {*} obj - The object to mask.
 * @returns {*} A new object with PII fields masked.
 *
 * @example
 * maskObject({ name: 'Jane Doe', email: 'jane@example.com', age: 30 });
 * // { name: 'J*** D**', email: 'j***@example.com', age: 30 }
 */
export function maskObject(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => maskObject(item));
  }

  const masked = {};
  for (const [key, value] of Object.entries(obj)) {
    const type = inferType(key);
    if (type && (typeof value === 'string' || typeof value === 'number')) {
      masked[key] = mask(String(value), type);
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskObject(value);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

/**
 * Logs data to the console with all PII fields masked.
 * Safe for use in development and production logging.
 *
 * @param {string} label - A label for the log entry.
 * @param {*} data - The data to log (will be masked before output).
 *
 * @example
 * safeLog('User Info', { name: 'Jane Doe', email: 'jane@example.com' });
 * // Console: [CSNP] User Info: { name: 'J*** D**', email: 'j***@example.com' }
 */
export function safeLog(label, data) {
  try {
    const maskedData = maskObject(data);
    // eslint-disable-next-line no-console
    console.log(`[CSNP] ${label}:`, maskedData);
  } catch (_err) {
    // eslint-disable-next-line no-console
    console.log(`[CSNP] ${label}: [unable to mask data]`);
  }
}