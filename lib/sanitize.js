/**
 * Input Sanitization Utilities
 * Protects against XSS attacks and ensures data integrity
 */

/**
 * Sanitize text input by removing HTML tags and dangerous characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeText(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Limit length to prevent DoS
        .slice(0, 500);
}

/**
 * Sanitize name input (allows letters, spaces, hyphens, apostrophes)
 * @param {string} input - The name to sanitize
 * @returns {string} - Sanitized name
 */
export function sanitizeName(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[^a-zA-Z\s'-]/g, '')
        .slice(0, 100);
}

/**
 * Sanitize phone number (allows digits, +, -, spaces, parentheses)
 * @param {string} input - The phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export function sanitizePhone(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[^0-9+\-\s()]/g, '')
        .slice(0, 20);
}

/**
 * Sanitize email address
 * @param {string} input - The email to sanitize
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9@._-]/g, '')
        .slice(0, 254); // Max email length per RFC
}

/**
 * Sanitize city/location name
 * @param {string} input - The city name to sanitize
 * @returns {string} - Sanitized city name
 */
export function sanitizeCity(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[^a-zA-Z\s'-]/g, '')
        .slice(0, 100);
}

/**
 * Sanitize date input (YYYY-MM-DD format)
 * @param {string} input - The date string
 * @returns {string} - Sanitized date or empty string if invalid
 */
export function sanitizeDate(input) {
    if (typeof input !== 'string') return '';

    // Check if it matches YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input)) return '';

    // Validate it's a real date
    const date = new Date(input);
    if (isNaN(date.getTime())) return '';

    return input;
}

/**
 * Sanitize time input (HH:MM format)
 * @param {string} input - The time string
 * @returns {string} - Sanitized time or empty string if invalid
 */
export function sanitizeTime(input) {
    if (typeof input !== 'string') return '';

    // Check if it matches HH:MM format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(input)) return '';

    return input;
}

/**
 * Sanitize object with multiple fields
 * @param {Object} data - Object containing form data
 * @param {Object} schema - Schema defining sanitization rules for each field
 * @returns {Object} - Sanitized object
 */
export function sanitizeObject(data, schema) {
    const sanitized = {};

    for (const [key, sanitizer] of Object.entries(schema)) {
        if (data.hasOwnProperty(key)) {
            sanitized[key] = sanitizer(data[key]);
        }
    }

    return sanitized;
}

/**
 * Validate and sanitize booking details
 * @param {Object} details - Booking details object
 * @returns {Object} - Sanitized booking details
 */
export function sanitizeBookingDetails(details) {
    return sanitizeObject(details, {
        beneficiaryName: sanitizeName,
        birthPlace: sanitizeCity,
        birthDate: sanitizeDate,
        birthTime: sanitizeTime,
        propertySize: (input) => {
            const num = parseInt(input);
            return isNaN(num) || num < 0 ? '' : Math.min(num, 999999).toString();
        }
    });
}

/**
 * Validate and sanitize onboarding data
 * @param {Object} data - Onboarding form data
 * @returns {Object} - Sanitized onboarding data
 */
export function sanitizeOnboardingData(data) {
    return sanitizeObject(data, {
        gender: (input) => ['Male', 'Female', 'Other'].includes(input) ? input : '',
        dob: sanitizeDate,
        birthCity: sanitizeCity,
        birthCountry: sanitizeText,
        whatsapp: sanitizePhone
    });
}
