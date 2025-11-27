/**
 * URL Refresh Service
 *
 * Centralized service for fetching fresh S3 signed URLs from the API
 * Includes request deduplication to prevent multiple concurrent requests for the same resource
 */

import { PhotosService, UserProfileService } from '@/api';

// Pending request tracking for deduplication
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Refresh photo preview URL
 * @param photoId - Photo ID
 * @returns Promise<string> Fresh signed URL
 */
export const refreshPhotoUrl = async (photoId: string): Promise<string> => {
  const key = `photo-${photoId}`;

  // Check if request already pending
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  // Create new request
  const promise = (async () => {
    try {
      const response = await PhotosService.showPhoto(photoId);

      if (response.success && response.data?.preview_url) {
        return response.data.preview_url;
      }

      throw new Error('Failed to get preview URL from API');
    } catch (error: any) {
      console.error(`[urlRefreshService] Error refreshing photo URL:`, error);
      throw new Error(error.body?.message || 'Failed to refresh photo URL');
    } finally {
      // Remove from pending after completion
      pendingRequests.delete(key);
    }
  })();

  // Store pending request
  pendingRequests.set(key, promise);

  return promise;
};

/**
 * Refresh photo thumbnail URL
 * @param photoId - Photo ID
 * @returns Promise<string> Fresh signed URL
 */
export const refreshThumbnailUrl = async (photoId: string): Promise<string> => {
  const key = `thumbnail-${photoId}`;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = (async () => {
    try {
      const response = await PhotosService.showPhoto(photoId);

      if (response.success && response.data?.thumbnail_url) {
        return response.data.thumbnail_url;
      }

      throw new Error('Failed to get thumbnail URL from API');
    } catch (error: any) {
      console.error(`[urlRefreshService] Error refreshing thumbnail URL:`, error);
      throw new Error(error.body?.message || 'Failed to refresh thumbnail URL');
    } finally {
      pendingRequests.delete(key);
    }
  })();

  pendingRequests.set(key, promise);
  return promise;
};

/**
 * Refresh user avatar URL
 * @returns Promise<string> Fresh signed URL
 */
export const refreshAvatarUrl = async (): Promise<string> => {
  const key = 'avatar-current-user';

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = (async () => {
    try {
      const response = await UserProfileService.getUserProfile();

      if (response.success && response.data?.avatar_url) {
        return response.data.avatar_url;
      }

      // Avatar might be null, which is okay
      return '';
    } catch (error: any) {
      console.error(`[urlRefreshService] Error refreshing avatar URL:`, error);
      throw new Error(error.body?.message || 'Failed to refresh avatar URL');
    } finally {
      pendingRequests.delete(key);
    }
  })();

  pendingRequests.set(key, promise);
  return promise;
};

/**
 * Refresh photographer avatar URL
 * @param userId - User ID or username
 * @returns Promise<string> Fresh signed URL
 */
export const refreshPhotographerAvatarUrl = async (userId: string): Promise<string> => {
  const key = `avatar-${userId}`;

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = (async () => {
    try {
      // Note: You may need to adjust this based on your actual API endpoint
      // for fetching other users' profiles
      const response = await UserProfileService.getPhotographerProfile(userId);

      if (response.success && response.data?.avatar_url) {
        return response.data.avatar_url;
      }

      return '';
    } catch (error: any) {
      console.error(`[urlRefreshService] Error refreshing photographer avatar URL:`, error);
      throw new Error(error.body?.message || 'Failed to refresh photographer avatar URL');
    } finally {
      pendingRequests.delete(key);
    }
  })();

  pendingRequests.set(key, promise);
  return promise;
};

/**
 * Generic URL refresh function
 * Delegates to specific functions based on resource type and URL type
 *
 * @param resourceId - Resource ID
 * @param urlType - Type of URL ('preview' | 'thumbnail' | 'avatar')
 * @param resourceType - Type of resource ('photo' | 'user')
 * @returns Promise<string> Fresh signed URL
 */
export const refreshUrl = async (
  resourceId: string,
  urlType: string,
  resourceType: string = 'photo'
): Promise<string> => {
  if (resourceType === 'photo') {
    if (urlType === 'preview') {
      return refreshPhotoUrl(resourceId);
    } else if (urlType === 'thumbnail') {
      return refreshThumbnailUrl(resourceId);
    }
  } else if (resourceType === 'user') {
    if (urlType === 'avatar') {
      if (resourceId === 'current') {
        return refreshAvatarUrl();
      } else {
        return refreshPhotographerAvatarUrl(resourceId);
      }
    }
  }

  throw new Error(`Unsupported URL type: ${resourceType}/${urlType}`);
};

/**
 * Clear all pending requests (useful for cleanup)
 */
export const clearPendingRequests = (): void => {
  pendingRequests.clear();
};

/**
 * Get number of pending requests (useful for debugging)
 */
export const getPendingRequestCount = (): number => {
  return pendingRequests.size;
};

// Export default for convenience
export default {
  refreshPhotoUrl,
  refreshThumbnailUrl,
  refreshAvatarUrl,
  refreshPhotographerAvatarUrl,
  refreshUrl,
  clearPendingRequests,
  getPendingRequestCount
};
