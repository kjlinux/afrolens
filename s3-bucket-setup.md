# S3 Bucket Configuration

## Bucket Information

### General Configuration
- **AWS Region**: Europe (Stockholm) `eu-north-1`
- **Bucket Type**: General purpose
- **Bucket Name**: `pouire-photos`

### Object Ownership
- **Setting**: ACLs disabled (recommended)
- **Description**: All objects in this bucket are owned by this account. Access to this bucket and its objects is specified using only policies.

### Block Public Access Settings
- **Block all public access**: Enabled
  - Block public access to buckets and objects granted through new ACLs
  - Block public access to buckets and objects granted through any ACLs
  - Block public access to buckets and objects granted through new public bucket or access point policies
  - Block public and cross-account access to buckets and objects through any public bucket or access point policies

### Bucket Versioning
- **Status**: Disabled

### Default Encryption
- **Encryption Type**: Server-side encryption with Amazon S3 managed keys (SSE-S3)
- **Bucket Key**: Enabled (reduces encryption costs by lowering calls to AWS KMS)

### Advanced Settings
- **Object Lock**: Disabled

## AWS CLI Commands

### Create the bucket
```bash
aws s3api create-bucket \
  --bucket pouire-photos \
  --region eu-north-1 \
  --create-bucket-configuration LocationConstraint=eu-north-1
```

### Configure Object Ownership (ACLs disabled)
```bash
aws s3api put-bucket-ownership-controls \
  --bucket pouire-photos \
  --ownership-controls Rules=[{ObjectOwnership=BucketOwnerEnforced}]
```

### Configure Public Access Block
```bash
aws s3api put-public-access-block \
  --bucket pouire-photos \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### Configure Default Encryption (SSE-S3)
```bash
aws s3api put-bucket-encryption \
  --bucket pouire-photos \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      },
      "BucketKeyEnabled": true
    }]
  }'
```

## PHP/Laravel Implementation

### Install AWS SDK for PHP
```bash
composer require aws/aws-sdk-php
```

### Configuration in .env
```env
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_DEFAULT_REGION=eu-north-1
AWS_BUCKET=pouire-photos
AWS_URL=https://pouire-photos.s3.eu-north-1.amazonaws.com
AWS_USE_PATH_STYLE_ENDPOINT=false
FILESYSTEM_DISK=s3
```

### Laravel Filesystem Configuration (config/filesystems.php)
```php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION'),
    'bucket' => env('AWS_BUCKET'),
    'url' => env('AWS_URL'),
    'endpoint' => env('AWS_ENDPOINT'),
    'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
    'throw' => false,
],
```

### Usage Example in Laravel
```php
use Illuminate\Support\Facades\Storage;

// Upload a file
Storage::disk('s3')->put('images/photo.jpg', file_get_contents($request->file('photo')));

// Get file URL
$url = Storage::disk('s3')->url('images/photo.jpg');

// Delete a file
Storage::disk('s3')->delete('images/photo.jpg');

// Check if file exists
$exists = Storage::disk('s3')->exists('images/photo.jpg');
```

## Security Notes

1. **Private Bucket**: This configuration creates a private bucket with all public access blocked
2. **Encryption**: All objects are automatically encrypted using SSE-S3
3. **Access Control**: Access is managed through IAM policies and bucket policies, not ACLs
4. **Bucket Key**: Enabled to reduce KMS costs (though we're using SSE-S3, not KMS)

## Next Steps

1. Create the bucket using the AWS CLI commands above
2. Configure IAM user/role with appropriate S3 permissions
3. Add AWS credentials to your Laravel `.env` file
4. Test file upload/download functionality
