# Frontend Integration Guide - S3 Signed URLs

## Overview

The backend now uses **AWS S3 with private buckets and signed URLs** for all file storage. This means all files (photos, avatars, covers, invoices) are stored privately and accessed through temporary signed URLs.

## Important Changes for Frontend Team

### 1. **URL Expiration**

All URLs returned from the API are **temporary** and will expire:

- **Preview/Thumbnail URLs**: Expire after **60 minutes**
- **Avatar URLs**: Expire after **24 hours** (1440 minutes)
- **Download URLs**: Expire after **24 hours** (1440 minutes)
- **Invoice URLs**: Expire after **60 minutes**

### 2. **DO NOT Cache URLs Long-Term**

❌ **WRONG**: Storing URLs in localStorage/sessionStorage for days
```javascript
// BAD - URL will expire!
localStorage.setItem('photoPreview', photo.preview_url);

// Later (after 60 minutes)
const url = localStorage.getItem('photoPreview'); // This URL is now expired!
```

✅ **CORRECT**: Re-fetch data when URLs expire
```javascript
// GOOD - Fetch fresh data when needed
const fetchPhoto = async (photoId) => {
  const response = await api.get(`/photos/${photoId}`);
  return response.data; // Fresh URLs every time
};
```

### 3. **Handling Expired URLs**

When a signed URL expires, S3 returns a 403 Forbidden error. Your frontend should:

1. **Detect the error** (403 status code)
2. **Re-fetch the resource** from the API to get a fresh signed URL
3. **Retry the request** with the new URL

Example error handling:
```javascript
const loadImage = async (photoId, currentUrl) => {
  try {
    // Try loading the image
    await fetch(currentUrl);
  } catch (error) {
    if (error.status === 403) {
      // URL expired - fetch fresh data
      const freshData = await api.get(`/photos/${photoId}`);
      return freshData.preview_url; // New signed URL
    }
    throw error;
  }
};
```

### 4. **API Response Format**

All API endpoints now return **signed URLs** in the response:

```json
{
  "id": "9d445a1c-85c5-4b6d-9c38-99a4915d6dac",
  "title": "Sunset Beach",
  "preview_url": "https://pouire-photos.s3.eu-north-1.amazonaws.com/photos/123/previews/preview.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "thumbnail_url": "https://pouire-photos.s3.eu-north-1.amazonaws.com/photos/123/thumbnails/thumb.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...",
  "photographer": {
    "id": "456",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://pouire-photos.s3.eu-north-1.amazonaws.com/users/456/avatars/avatar.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=..."
  }
}
```

### 5. **Image Caching Strategy**

#### Browser Caching (Automatic)
- Browsers will cache images automatically using HTTP cache headers
- S3 signed URLs include cache control headers
- No special handling needed for browser caching

#### Application-Level Caching
If you implement application-level caching (e.g., React Query, SWR):

```javascript
// Using React Query
const { data: photo } = useQuery(
  ['photo', photoId],
  () => fetchPhoto(photoId),
  {
    staleTime: 30 * 60 * 1000, // 30 minutes (less than URL expiration)
    cacheTime: 45 * 60 * 1000, // 45 minutes
  }
);
```

**Recommendation**: Set cache time to **less than the URL expiration** to avoid serving expired URLs.

### 6. **File Uploads**

File uploads remain **unchanged**. Continue using the existing upload endpoints:

```javascript
// Photo upload (no changes needed)
const formData = new FormData();
formData.append('photo', file);
formData.append('title', 'My Photo');

await api.post('/photographer/photos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

The backend handles S3 upload and returns paths that are converted to signed URLs in API responses.

### 7. **Download Endpoints**

Download endpoints redirect to signed URLs:

```javascript
// Download photo (purchased)
window.location.href = `/api/downloads/photo/${photoId}`;

// Download order (all photos as ZIP)
window.location.href = `/api/downloads/order/${orderId}`;

// Download invoice
window.location.href = `/api/downloads/invoice/${orderId}`;

// Download preview (public, no auth required)
window.location.href = `/api/downloads/preview/${photoId}`;
```

These endpoints will redirect to S3 signed URLs automatically.

### 8. **CORS Configuration**

✅ **No CORS changes needed** on frontend!

Since all file access goes through backend API endpoints (which return signed URLs), there are no cross-origin requests from frontend to S3. The signed URLs handle CORS internally.

### 9. **Security Considerations**

#### Public Sharing
If users want to share photos publicly:

❌ **DO NOT** share the signed URL directly (it expires!)

✅ **DO** share a link to your frontend application:
```javascript
// GOOD - Share frontend URL
const shareUrl = `https://yourapp.com/photos/${photoId}`;

// When someone visits, your app fetches fresh signed URLs
```

#### Preventing URL Theft
- Signed URLs include authentication in the query parameters
- URLs are temporary and expire automatically
- No additional security measures needed from frontend

### 10. **Example: Photo Gallery Component**

```javascript
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

const PhotoGallery = () => {
  const { data: photos, refetch } = useQuery(
    'photos',
    () => api.get('/photos').then(res => res.data),
    {
      staleTime: 30 * 60 * 1000, // 30 min
      onError: (error) => {
        if (error.response?.status === 403) {
          // URLs expired, refetch
          refetch();
        }
      }
    }
  );

  return (
    <div className="gallery">
      {photos?.map(photo => (
        <img
          key={photo.id}
          src={photo.thumbnail_url}
          alt={photo.title}
          onError={(e) => {
            // If image fails to load (expired URL), refetch
            fetch(photo.thumbnail_url)
              .then(res => {
                if (!res.ok && res.status === 403) {
                  refetch();
                }
              });
          }}
        />
      ))}
    </div>
  );
};
```

### 11. **Testing Checklist**

Frontend team should test:

- [ ] Images load correctly from signed URLs
- [ ] URLs expire after expected time (60 min for previews)
- [ ] Application handles expired URLs gracefully
- [ ] Re-fetching data provides fresh URLs
- [ ] Photo uploads still work
- [ ] Downloads redirect correctly
- [ ] Avatar images display properly
- [ ] Gallery performance is acceptable with URL expiration handling

### 12. **Performance Optimization Tips**

1. **Prefetch data** before users need it
2. **Use React Query or SWR** for automatic cache invalidation
3. **Implement lazy loading** for images
4. **Set appropriate stale times** (less than URL expiration)
5. **Use loading skeletons** while fetching fresh URLs

### 13. **Migration Path**

If you have existing code that caches URLs:

1. **Identify** all places where URLs are stored/cached
2. **Reduce cache time** to less than URL expiration
3. **Add error handling** for 403 errors
4. **Test** with expired URLs to ensure graceful handling
5. **Update** sharing features to use frontend URLs, not S3 URLs

### 14. **Common Mistakes to Avoid**

❌ Storing S3 URLs in database
❌ Caching URLs for more than expiration time
❌ Sharing signed URLs directly with users
❌ Assuming URLs are permanent
❌ Not handling 403 errors

✅ Fetching fresh data when needed
✅ Using frontend URLs for sharing
✅ Implementing proper error handling
✅ Setting cache times less than expiration
✅ Testing with expired URLs

## Questions?

If you have any questions about the S3 integration, please contact the backend team.

## Summary

**Key Takeaway**: All file URLs from the API are temporary (expire after 60 min to 24 hours). Don't cache them long-term. Re-fetch data from API when URLs expire. No changes needed for uploads or CORS.
