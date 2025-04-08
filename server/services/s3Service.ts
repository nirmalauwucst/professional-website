import AWS from "aws-sdk";

// Create a fallback mechanism for when AWS S3 is not properly configured
const FALLBACK_MODE = !process.env.AWS_S3_BUCKET || 
                     !process.env.AWS_ACCESS_KEY_ID || 
                     !process.env.AWS_SECRET_ACCESS_KEY || 
                     !process.env.AWS_REGION;

// Additional debugging for S3 configuration
const region = process.env.AWS_REGION;
const bucketName = process.env.AWS_S3_BUCKET || "nmad-blog-post-storage";

// Log S3 configuration but mask sensitive data
console.log(`S3 Configuration: 
- Region: ${region || 'Not set'}
- Bucket: ${bucketName || 'Not set'}
- Access Key ID: ${process.env.AWS_ACCESS_KEY_ID ? '****' + process.env.AWS_ACCESS_KEY_ID.slice(-4) : 'Not set'}
- Secret Access Key: ${process.env.AWS_SECRET_ACCESS_KEY ? '****' : 'Not set'}
- Using Fallback Mode: ${FALLBACK_MODE ? 'Yes' : 'No'}`);

// Initialize S3 with environment variables
let s3: AWS.S3;
try {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region,
    signatureVersion: 'v4'
  });
} catch (error) {
  console.error("Error initializing S3 client:", error);
  // Create a dummy S3 client for fallback mode
  s3 = {} as AWS.S3;
}

// Local storage for fallback mode
const localImageStorage: Record<string, {buffer: Buffer, contentType: string, url: string}> = {};
const localMarkdownStorage: Record<string, {content: string, url: string}> = {};

// Generate a local URL for fallback mode
const generateLocalUrl = (key: string, isImage: boolean = false): string => {
  const baseUrl = `/api/local-storage/${isImage ? 'images' : 'markdown'}`;
  const sanitizedKey = key.replace(/\//g, '-');
  return `${baseUrl}/${sanitizedKey}`;
};

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
  console.log(`Attempting to upload markdown with key: ${key}`);
  
  // If in fallback mode, store locally
  if (FALLBACK_MODE) {
    console.log(`Using fallback storage for markdown: ${key}`);
    const localUrl = generateLocalUrl(key);
    localMarkdownStorage[key] = {
      content,
      url: localUrl
    };
    return localUrl;
  }
  
  // Ensure key doesn't start with blog/ already to avoid double prefixing
  const fullKey = key.startsWith("blog/") ? key : `blog/${key}`;

  const params = {
    Bucket: bucketName,
    Key: fullKey,
    Body: content,
    ContentType: "text/markdown",
    ACL: 'public-read'
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
    const typedError = error as { code?: string };
    if (typedError.code === 'InvalidBucketName') {
      console.error(`The bucket name "${params.Bucket}" is invalid. S3 bucket names must be between 3 and 63 characters long and can only contain lowercase letters, numbers, periods, and hyphens.`);
    } else if (typedError.code === 'NoSuchBucket') {
      console.error(`The bucket "${params.Bucket}" does not exist or you do not have access to it.`);
    } else if (typedError.code === 'NetworkingError') {
      console.error(`Network error occurred. Please check your internet connection and AWS region settings.`);
    }
    
    // Switch to fallback mode for this upload
    console.log(`Switching to fallback storage after S3 error for: ${key}`);
    const localUrl = generateLocalUrl(key);
    localMarkdownStorage[key] = {
      content,
      url: localUrl
    };
    return localUrl;
  }
};

/**
 * Retrieves markdown content from S3
 * @param key The filename/key of the S3 object
 * @returns The markdown content as a string
 */
export const getMarkdown = async (key: string): Promise<string> => {
  // Check if we have this in local storage first
  if (key in localMarkdownStorage) {
    console.log(`Serving markdown from local storage: ${key}`);
    return localMarkdownStorage[key].content;
  }

  if (FALLBACK_MODE) {
    console.error(`Cannot retrieve markdown from S3: AWS not configured and content not in local storage: ${key}`);
    return "Content not available";
  }

  // Ensure key doesn't start with blog/ already to avoid double prefixing
  const fullKey = key.startsWith("blog/") ? key : `blog/${key}`;

  const params = {
    Bucket: bucketName,
    Key: fullKey,
  };

  try {
    const response = await s3.getObject(params).promise();
    return response.Body?.toString() || "";
  } catch (error) {
    console.error("Error fetching from S3:", error);
    return "Error retrieving content";
  }
};

/**
 * Deletes a markdown file from S3
 * @param key The filename/key of the S3 object to delete
 */
export const deleteMarkdown = async (key: string): Promise<void> => {
  // Remove from local storage if present
  if (key in localMarkdownStorage) {
    console.log(`Deleting markdown from local storage: ${key}`);
    delete localMarkdownStorage[key];
    return;
  }

  if (FALLBACK_MODE) {
    console.log(`Skipping S3 deletion in fallback mode: ${key}`);
    return;
  }

  // Ensure key doesn't start with blog/ already to avoid double prefixing
  const fullKey = key.startsWith("blog/") ? key : `blog/${key}`;

  const params = {
    Bucket: bucketName,
    Key: fullKey,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Successfully deleted from S3: ${fullKey}`);
  } catch (error) {
    console.error("Error deleting from S3:", error);
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
  console.log(`Attempting to upload image with key: ${key}`);
  
  // If in fallback mode, store locally
  if (FALLBACK_MODE) {
    console.log(`Using fallback storage for image: ${key}`);
    const localUrl = generateLocalUrl(key, true);
    localImageStorage[key] = {
      buffer,
      contentType,
      url: localUrl
    };
    return localUrl;
  }

  // Ensure prefix is consistent but not duplicated
  let fullKey = key;
  if (!key.startsWith("blog/")) {
    if (!key.startsWith("images/")) {
      fullKey = `blog/images/${key}`;
    } else {
      fullKey = `blog/${key}`;
    }
  }

  const params = {
    Bucket: bucketName,
    Key: fullKey,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read'
  };

  try {
    console.log(`Attempting to upload image to S3:
    - Bucket: ${params.Bucket}
    - Key: ${params.Key}
    - Content Type: ${params.ContentType}
    - Content Length: ${buffer.length} bytes
    - Region: ${process.env.AWS_REGION || 'Not set'}`);
    
    const response = await s3.upload(params).promise();
    console.log(`Successfully uploaded image to S3. Location: ${response.Location || 'No location returned'}`);
    
    // If the response doesn't include a Location, construct one
    if (!response.Location) {
      const constructedUrl = `https://${bucketName}.s3.${region || 'us-east-1'}.amazonaws.com/${fullKey}`;
      console.log(`No location in response, using constructed URL: ${constructedUrl}`);
      return constructedUrl;
    }
    
    return response.Location;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
    
    // Add more detailed error logging
    const typedError = error as { code?: string };
    if (typedError.code === 'InvalidBucketName') {
      console.error(`The bucket name "${params.Bucket}" is invalid. S3 bucket names must be between 3 and 63 characters long and can only contain lowercase letters, numbers, periods, and hyphens.`);
    } else if (typedError.code === 'NoSuchBucket') {
      console.error(`The bucket "${params.Bucket}" does not exist or you do not have access to it.`);
    } else if (typedError.code === 'NetworkingError') {
      console.error(`Network error occurred. Please check your internet connection and AWS region settings.`);
    }
    
    // Switch to fallback mode for this upload
    console.log(`Switching to fallback storage after S3 error for: ${key}`);
    const localUrl = generateLocalUrl(key, true);
    localImageStorage[key] = {
      buffer,
      contentType,
      url: localUrl
    };
    return localUrl;
  }
};

// Export local storage for routes implementation
export const getLocalStorage = () => ({
  localImageStorage,
  localMarkdownStorage
});
