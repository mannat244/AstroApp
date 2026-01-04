/**
 * Client-side rate limiter using localStorage
 * Prevents abuse by limiting actions within a time window
 */

class RateLimiter {
    constructor(key, maxAttempts, windowMs) {
        this.key = `rateLimit_${key}`;
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    /**
     * Check if action is allowed
     * @returns {Object} { allowed: boolean, remainingAttempts: number, resetTime: number }
     */
    checkLimit() {
        if (typeof window === 'undefined') {
            return { allowed: true, remainingAttempts: this.maxAttempts, resetTime: 0 };
        }

        const now = Date.now();
        const data = this.getData();

        // Reset if window has passed
        if (now > data.resetTime) {
            this.reset();
            return { allowed: true, remainingAttempts: this.maxAttempts - 1, resetTime: now + this.windowMs };
        }

        // Check if limit exceeded
        if (data.attempts >= this.maxAttempts) {
            const waitTime = Math.ceil((data.resetTime - now) / 1000);
            return {
                allowed: false,
                remainingAttempts: 0,
                resetTime: data.resetTime,
                waitTime
            };
        }

        return {
            allowed: true,
            remainingAttempts: this.maxAttempts - data.attempts - 1,
            resetTime: data.resetTime
        };
    }

    /**
     * Record an attempt
     * @returns {boolean} Whether the attempt was allowed
     */
    attempt() {
        const check = this.checkLimit();

        if (!check.allowed) {
            return false;
        }

        const data = this.getData();
        const now = Date.now();

        // Reset if window has passed
        if (now > data.resetTime) {
            this.setData({
                attempts: 1,
                resetTime: now + this.windowMs
            });
        } else {
            this.setData({
                attempts: data.attempts + 1,
                resetTime: data.resetTime
            });
        }

        return true;
    }

    /**
     * Get stored data
     * @private
     */
    getData() {
        if (typeof window === 'undefined') {
            return { attempts: 0, resetTime: Date.now() + this.windowMs };
        }

        try {
            const stored = localStorage.getItem(this.key);
            if (!stored) {
                return { attempts: 0, resetTime: Date.now() + this.windowMs };
            }
            return JSON.parse(stored);
        } catch (error) {
            console.error('Rate limiter error:', error);
            return { attempts: 0, resetTime: Date.now() + this.windowMs };
        }
    }

    /**
     * Set stored data
     * @private
     */
    setData(data) {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(this.key, JSON.stringify(data));
        } catch (error) {
            console.error('Rate limiter error:', error);
        }
    }

    /**
     * Reset the rate limiter
     */
    reset() {
        if (typeof window === 'undefined') return;

        try {
            localStorage.removeItem(this.key);
        } catch (error) {
            console.error('Rate limiter error:', error);
        }
    }

    /**
     * Get remaining time until reset (in seconds)
     */
    getTimeUntilReset() {
        const data = this.getData();
        const now = Date.now();

        if (now > data.resetTime) {
            return 0;
        }

        return Math.ceil((data.resetTime - now) / 1000);
    }
}

/**
 * Pre-configured rate limiters for common actions
 */
export const rateLimiters = {
    // Booking attempts: 3 attempts per 5 minutes
    booking: new RateLimiter('booking', 3, 5 * 60 * 1000),

    // Login attempts: 5 attempts per 15 minutes
    login: new RateLimiter('login', 5, 15 * 60 * 1000),

    // Form submissions: 10 attempts per minute
    formSubmit: new RateLimiter('formSubmit', 10, 60 * 1000),

    // Profile updates: 5 attempts per 10 minutes
    profileUpdate: new RateLimiter('profileUpdate', 5, 10 * 60 * 1000),
};

/**
 * Create a custom rate limiter
 * @param {string} key - Unique identifier for this rate limiter
 * @param {number} maxAttempts - Maximum attempts allowed
 * @param {number} windowMs - Time window in milliseconds
 */
export function createRateLimiter(key, maxAttempts, windowMs) {
    return new RateLimiter(key, maxAttempts, windowMs);
}

export default RateLimiter;
