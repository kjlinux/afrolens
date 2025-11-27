/**
 * S3 URL Cache Manager
 *
 * Manages in-memory caching of AWS S3 signed URLs with expiration tracking.
 * URLs are cached with TTL to avoid serving expired signed URLs.
 *
 * Cache automatically clears on page refresh (in-memory only, not localStorage).
 */

const urlCache = new Map();
const MAX_CACHE_SIZE = 1000;

/**
 * Generate a cache key from resource information
 * @param {string} resourceType - Type of resource ('photo' | 'user')
 * @param {string} resourceId - ID of the resource
 * @param {string} urlType - Type of URL ('preview' | 'thumbnail' | 'avatar')
 * @returns {string} Cache key
 */
export const generateCacheKey = (resourceType, resourceId, urlType) => {
  return `${resourceType}-${resourceId}-${urlType}`;
};

/**
 * Get cached URL if still valid
 * @param {string} key - Cache key
 * @returns {string|null} Cached URL or null if expired/not found
 */
export const getCachedUrl = (key) => {
  const cached = urlCache.get(key);

  if (!cached) {
    return null;
  }

  // Check if expired
  if (Date.now() > cached.expiresAt) {
    urlCache.delete(key);
    return null;
  }

  return cached.url;
};

/**
 * Store URL in cache with expiration time
 * @param {string} key - Cache key
 * @param {string} url - URL to cache
 * @param {number} ttlMinutes - Time to live in minutes
 */
export const setCachedUrl = (key, url, ttlMinutes) => {
  // Prevent cache from growing unbounded
  if (urlCache.size >= MAX_CACHE_SIZE) {
    clearExpiredUrls();

    // If still at max after cleanup, remove oldest entries
    if (urlCache.size >= MAX_CACHE_SIZE) {
      const firstKey = urlCache.keys().next().value;
      urlCache.delete(firstKey);
    }
  }

  const expiresAt = Date.now() + (ttlMinutes * 60 * 1000);

  urlCache.set(key, {
    url,
    expiresAt,
    fetchedAt: Date.now()
  });
};

/**
 * Invalidate a cached URL (force refresh on next access)
 * @param {string} key - Cache key
 */
export const invalidateUrl = (key) => {
  urlCache.delete(key);
};

/**
 * Clear all expired URLs from cache
 * @returns {number} Number of expired URLs removed
 */
export const clearExpiredUrls = () => {
  const now = Date.now();
  let removedCount = 0;

  for (const [key, value] of urlCache.entries()) {
    if (now > value.expiresAt) {
      urlCache.delete(key);
      removedCount++;
    }
  }

  return removedCount;
};

/**
 * Clear all cached URLs
 */
export const clearAllUrls = () => {
  urlCache.clear();
};

/**
 * Get cache statistics (useful for debugging)
 * @returns {Object} Cache statistics
 */
export const getCacheStats = () => {
  const now = Date.now();
  let validCount = 0;
  let expiredCount = 0;

  for (const [, value] of urlCache.entries()) {
    if (now > value.expiresAt) {
      expiredCount++;
    } else {
      validCount++;
    }
  }

  return {
    totalSize: urlCache.size,
    validUrls: validCount,
    expiredUrls: expiredCount,
    maxSize: MAX_CACHE_SIZE
  };
};

// Periodic cleanup - every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const removed = clearExpiredUrls();
    if (removed > 0) {
      console.debug(`[S3 Cache] Cleaned up ${removed} expired URLs`);
    }
  }, 5 * 60 * 1000);
}
