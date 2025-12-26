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
  const maxRetries = 1;

  // Use refs to avoid re-renders when these change
  const fetchUrlFnRef = useRef(fetchUrlFn);
  const initialUrlRef = useRef(initialUrl);
  const loadedRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    fetchUrlFnRef.current = fetchUrlFn;
  }, [fetchUrlFn]);

  useEffect(() => {
    initialUrlRef.current = initialUrl;
  }, [initialUrl]);

  const cacheKey = resourceId ? generateCacheKey(resourceType, resourceId, urlType) : null;

  /**
   * Load URL (from cache or API)
   */
  const loadUrl = useCallback(async (forceRefresh = false) => {
    if (!resourceId || !cacheKey) {
      setLoading(false);
      return null;
    }

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

      // Try to use fetchUrlFn if available
      let freshUrl = null;
      if (fetchUrlFnRef.current) {
        try {
          freshUrl = await fetchUrlFnRef.current(resourceId, urlType);
        } catch (err) {
          console.error(`[useS3Image] Error fetching URL:`, err);
        }
      }

      // Fall back to initialUrl if fetchUrlFn failed or wasn't provided
      if (!freshUrl && initialUrlRef.current) {
        freshUrl = initialUrlRef.current;
      }

      if (!freshUrl) {
        throw new Error('No URL available');
      }

      // Cache the URL with appropriate TTL
      const ttl = S3_URL_TTL[urlType.toUpperCase()] || S3_URL_TTL.PREVIEW;
      setCachedUrl(cacheKey, freshUrl, ttl);

      setImageUrl(freshUrl);
      setLoading(false);
      retryCountRef.current = 0;

      return freshUrl;
    } catch (err) {
      console.error(`[useS3Image] Error loading URL for ${cacheKey}:`, err);
      setError(err);
      setLoading(false);
      return null;
    }
  }, [resourceId, cacheKey, urlType]);

  /**
   * Handle image load error (403 = expired URL)
   */
  const handleImageError = useCallback(async () => {
    if (!imageUrl || !cacheKey) return;

    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });

      if (response.status === 403) {
        console.warn(`[useS3Image] 403 error for ${cacheKey} - URL expired, refreshing...`);
        invalidateUrl(cacheKey);

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
    }
  }, [imageUrl, cacheKey, loadUrl]);

  /**
   * Manual retry function
   */
  const retry = useCallback(async () => {
    if (!cacheKey) return;
    retryCountRef.current = 0;
    invalidateUrl(cacheKey);
    await loadUrl(true);
  }, [cacheKey, loadUrl]);

  /**
   * Prefetch URL for later use
   */
  const prefetch = useCallback(async () => {
    if (!cacheKey) return;
    const cachedUrl = getCachedUrl(cacheKey);
    if (!cachedUrl) {
      await loadUrl(false);
    }
  }, [cacheKey, loadUrl]);

  // Load URL when resourceId changes
  useEffect(() => {
    if (resourceId && resourceType && urlType) {
      // Check if we already have this URL cached or in state
      if (cacheKey) {
        const cachedUrl = getCachedUrl(cacheKey);
        if (cachedUrl) {
          setImageUrl(cachedUrl);
          setLoading(false);
          loadedRef.current = true;
          return;
        }
      }

      // Use initialUrl directly if available
      if (initialUrlRef.current) {
        const ttl = S3_URL_TTL[urlType.toUpperCase()] || S3_URL_TTL.PREVIEW;
        if (cacheKey) {
          setCachedUrl(cacheKey, initialUrlRef.current, ttl);
        }
        setImageUrl(initialUrlRef.current);
        setLoading(false);
        loadedRef.current = true;
        return;
      }

      // Otherwise fetch the URL
      loadUrl(false);
      loadedRef.current = true;
    } else if (!resourceId) {
      setLoading(false);
      setImageUrl(null);
      setError(null);
      loadedRef.current = false;
    }
  }, [resourceId, resourceType, urlType, cacheKey]);

  // Handle initialUrl updates after initial load
  useEffect(() => {
    if (initialUrl && resourceId && !imageUrl && loadedRef.current) {
      setImageUrl(initialUrl);
      setLoading(false);
      if (cacheKey) {
        const ttl = S3_URL_TTL[urlType.toUpperCase()] || S3_URL_TTL.PREVIEW;
        setCachedUrl(cacheKey, initialUrl, ttl);
      }
    }
  }, [initialUrl, resourceId, imageUrl, cacheKey, urlType]);

  return {
    imageUrl,
    loading,
    error,
    retry,
    prefetch,
    handleImageError
  };
};

export default useS3Image;
