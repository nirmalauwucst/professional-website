import AWS from "aws-sdk";

// Additional debugging for S3 configuration
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET || "";

// Log S3 configuration but mask sensitive data
console.log(`S3 Configuration: 
- Region: ${region || 'Not set'}
- Bucket: ${bucketName || 'Not set'}
- Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? '****' + process.env.AWS_ACCESS_KEY_ID.slice(-4) : 'Not set'}
- Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '****' : 'Not set'}`);

// Validate S3 bucket name format
if (bucketName) {
  // Bucket names must be between 3 and 63 characters long and can only contain 
  // lowercase letters, numbers, periods, and hyphens
  const bucketNameRegex = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
  if (!bucketNameRegex.test(bucketName)) {
    console.error(`WARNING: Invalid bucket name format: "${bucketName}". 
S3 bucket names must be between 3 and 63 characters long and can only contain 
lowercase letters, numbers, periods, and hyphens.`);
  }
}

// Initialize S3 with environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region,
});

/**
 * Uploads a markdown file to S3
 * @param key The filename/key for the S3 object
 * @param content The markdown content as a string
 * @returns The URL of the uploaded file
 */
export const uploadMarkdown = async (
  key: string,
  content: string,
): Promise<string> => {
  // Ensure key doesn't start with blog/ already to avoid double prefixing
  const fullKey = key.startsWith("blog/") ? key : `blog/${key}`;

  // Validate bucket name before attempting upload
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET environment variable is not set or empty");
  }

  const params = {
    Bucket: bucketName,
    Key: fullKey,
    Body: content,
    ContentType: "text/markdown",
    //ACL: 'public-read'
  };

  try {
    console.log(`Attempting to upload to S3:
    - Bucket: ${params.Bucket}
    - Key: ${params.Key}
    - Content Type: ${params.ContentType}
    - Content Length: ${content.length} bytes`);
    
    const response = await s3.upload(params).promise();
    console.log(`Successfully uploaded to S3. Location: ${response.Location}`);
    return response.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    
    // Add more detailed error logging
    if (error.code === 'InvalidBucketName') {
      console.error(`The bucket name "${params.Bucket}" is invalid. S3 bucket names must be between 3 and 63 characters long and can only contain lowercase letters, numbers, periods, and hyphens.`);
    } else if (error.code === 'NoSuchBucket') {
      console.error(`The bucket "${params.Bucket}" does not exist or you do not have access to it.`);
    } else if (error.code === 'NetworkingError') {
      console.error(`Network error occurred. Please check your internet connection and AWS region settings.`);
    }
    
    throw new Error(`Failed to upload file to S3: ${error}`);
  }
};

/**
 * Retrieves markdown content from S3
 * @param key The filename/key of the S3 object
 * @returns The markdown content as a string
 */
export const getMarkdown = async (key: string): Promise<string> => {
  // Ensure key doesn't start with blog/ already to avoid double prefixing
  const fullKey = key.startsWith("blog/") ? key : `blog/${key}`;

  // Validate bucket name before attempting retrieval
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET environment variable is not set or empty");
  }

  const params = {
    Bucket: bucketName,
    Key: fullKey,
  };

  try {
    const response = await s3.getObject(params).promise();
    return response.Body?.toString() || "";
  } catch (error) {
    console.error("Error fetching from S3:", error);
    throw new Error(`Failed to fetch file from S3: ${error}`);
  }
};

/**
 * Deletes a markdown file from S3
 * @param key The filename/key of the S3 object to delete
 */
export const deleteMarkdown = async (key: string): Promise<void> => {
  // Ensure key doesn't start with blog/ already to avoid double prefixing
  const fullKey = key.startsWith("blog/") ? key : `blog/${key}`;

  // Validate bucket name before attempting deletion
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET environment variable is not set or empty");
  }

  const params = {
    Bucket: bucketName,
    Key: fullKey,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error("Error deleting from S3:", error);
    throw new Error(`Failed to delete file from S3: ${error}`);
  }
};

/**
 * Uploads an image to S3
 * @param key The filename/key for the S3 object
 * @param buffer The image buffer
 * @param contentType The MIME type of the image
 * @returns The URL of the uploaded image
 */
export const uploadImage = async (
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> => {
  // Ensure prefix is consistent but not duplicated
  let fullKey = key;
  if (!key.startsWith("blog/")) {
    if (!key.startsWith("images/")) {
      fullKey = `blog/images/${key}`;
    } else {
      fullKey = `blog/${key}`;
    }
  }

  // Validate bucket name before attempting upload
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET environment variable is not set or empty");
  }

  const params = {
    Bucket: bucketName,
    Key: fullKey,
    Body: buffer,
    ContentType: contentType,
    //ACL: 'public-read'
  };

  try {
    console.log(`Attempting to upload image to S3:
    - Bucket: ${params.Bucket}
    - Key: ${params.Key}
    - Content Type: ${params.ContentType}
    - Content Length: ${buffer.length} bytes`);
    
    const response = await s3.upload(params).promise();
    console.log(`Successfully uploaded image to S3. Location: ${response.Location}`);
    return response.Location;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    
    // Add more detailed error logging
    if (error.code === 'InvalidBucketName') {
      console.error(`The bucket name "${params.Bucket}" is invalid. S3 bucket names must be between 3 and 63 characters long and can only contain lowercase letters, numbers, periods, and hyphens.`);
    } else if (error.code === 'NoSuchBucket') {
      console.error(`The bucket "${params.Bucket}" does not exist or you do not have access to it.`);
    } else if (error.code === 'NetworkingError') {
      console.error(`Network error occurred. Please check your internet connection and AWS region settings.`);
    }
    
    throw new Error(`Failed to upload image to S3: ${error}`);
  }
};
