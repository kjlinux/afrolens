import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getCachedUrl,
  setCachedUrl,
  invalidateUrl,
  generateCacheKey
} from '../utils/s3UrlCache';
import { S3_URL_TTL } from '../utils/constants';

/**
 * Custom hook for managing S3 signed URLs with automatic expiration handling
 *
 * @param {Object} options - Configuration options
 * @param {string} options.resourceId - ID of the resource (photo ID or user ID)
 * @param {string} options.resourceType - Type of resource ('photo' | 'user')
 * @param {string} options.urlType - Type of URL ('preview' | 'thumbnail' | 'avatar')
 * @param {string} [options.initialUrl] - Optional initial URL from API response
 * @param {function} [options.fetchUrlFn] - Optional custom function to fetch fresh URL
 *
 * @returns {Object} Hook state and methods
 * @returns {string|null} imageUrl - Current URL to display
 * @returns {boolean} loading - Loading state
 * @returns {Error|null} error - Error state
 * @returns {function} retry - Manual retry function
 * @returns {function} prefetch - Prefetch URL for later use
 */
export const useS3Image = ({
  resourceId,
  resourceType,
  urlType,
  initialUrl = null,
  fetchUrlFn = null
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);
  const maxRetries = 1; // Only retry once on 403 errors

  const cacheKey = generateCacheKey(resourceType, resourceId, urlType);

  /**
   * Get fresh URL from API
   */
  const fetchFreshUrl = useCallback(async () => {
    if (!fetchUrlFn) {
      // If no custom fetch function, use initial URL
      return initialUrl;
    }

    try {
      const url = await fetchUrlFn(resourceId, urlType);
      return url;
    } catch (err) {
      throw new Error(`Failed to fetch URL: ${err.message}`);
    }
  }, [resourceId, urlType, initialUrl, fetchUrlFn]);

  /**
   * Load URL (from cache or API)
   */
  const loadUrl = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      // Try to get from cache first
      if (!forceRefresh) {
        const cachedUrl = getCachedUrl(cacheKey);
        if (cachedUrl) {
          setImageUrl(cachedUrl);
          setLoading(false);
          return cachedUrl;
        }
      }

      // Fetch fresh URL
      const freshUrl = await fetchFreshUrl();

      if (!freshUrl) {
        throw new Error('No URL available');
      }

      // Cache the URL with appropriate TTL
      const ttl = S3_URL_TTL[urlType.toUpperCase()] || S3_URL_TTL.PREVIEW;
      setCachedUrl(cacheKey, freshUrl, ttl);

      setImageUrl(freshUrl);
      setLoading(false);
      retryCountRef.current = 0; // Reset retry count on success

      return freshUrl;
    } catch (err) {
      console.error(`[useS3Image] Error loading URL for ${cacheKey}:`, err);
      setError(err);
      setLoading(false);
      return null;
    }
  }, [cacheKey, urlType, fetchFreshUrl]);

  /**
   * Handle image load error (403 = expired URL)
   */
  const handleImageError = useCallback(async (event) => {
    // Check if this is a 403 error (expired signed URL)
    // We need to fetch the image to check the status
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });

      if (response.status === 403) {
        console.warn(`[useS3Image] 403 error for ${cacheKey} - URL expired, refreshing...`);

        // Invalidate cache
        invalidateUrl(cacheKey);

        // Retry once
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          await loadUrl(true);
        } else {
          setError(new Error('URL expired and retry limit reached'));
        }
      } else if (!response.ok) {
        console.error(`[useS3Image] Image load error ${response.status} for ${cacheKey}`);
        setError(new Error(`Image load failed with status ${response.status}`));
      }
    } catch (err) {
      console.error(`[useS3Image] Failed to check image status:`, err);
      // Don't set error here as it might be a network issue
    }
  }, [imageUrl, cacheKey, loadUrl]);

  /**
   * Manual retry function
   */
  const retry = useCallback(async () => {
    retryCountRef.current = 0; // Reset retry count
    invalidateUrl(cacheKey);
    await loadUrl(true);
  }, [cacheKey, loadUrl]);

  /**
   * Prefetch URL for later use
   */
  const prefetch = useCallback(async () => {
    const cachedUrl = getCachedUrl(cacheKey);
    if (!cachedUrl) {
      await loadUrl(false);
    }
  }, [cacheKey, loadUrl]);

  // Load URL on mount or when dependencies change
  useEffect(() => {
    if (resourceId && resourceType && urlType) {
      loadUrl(false);
    }
  }, [resourceId, resourceType, urlType, loadUrl]);

  // Use initial URL if provided and no cache exists
  useEffect(() => {
    if (initialUrl && !imageUrl && !loading) {
      const cachedUrl = getCachedUrl(cacheKey);
      if (!cachedUrl) {
        // Cache the initial URL
        const ttl = S3_URL_TTL[urlType.toUpperCase()] || S3_URL_TTL.PREVIEW;
        setCachedUrl(cacheKey, initialUrl, ttl);
        setImageUrl(initialUrl);
      }
    }
  }, [initialUrl, imageUrl, loading, cacheKey, urlType]);

  return {
    imageUrl,
    loading,
    error,
    retry,
    prefetch,
    handleImageError // Expose for img onError handler
  };
};

export default useS3Image;
