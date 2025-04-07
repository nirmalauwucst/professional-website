import AWS from 'aws-sdk';

// Initialize S3 with environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const bucketName = process.env.AWS_S3_BUCKET || '';

/**
 * Uploads a markdown file to S3
 * @param key The filename/key for the S3 object
 * @param content The markdown content as a string
 * @returns The URL of the uploaded file
 */
export const uploadMarkdown = async (key: string, content: string): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: `blog/${key}`,
    Body: content,
    ContentType: 'text/markdown',
    ACL: 'public-read'
  };

  try {
    const response = await s3.upload(params).promise();
    return response.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload file to S3: ${error}`);
  }
};

/**
 * Retrieves markdown content from S3
 * @param key The filename/key of the S3 object
 * @returns The markdown content as a string
 */
export const getMarkdown = async (key: string): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: `blog/${key}`
  };

  try {
    const response = await s3.getObject(params).promise();
    return response.Body?.toString() || '';
  } catch (error) {
    console.error('Error fetching from S3:', error);
    throw new Error(`Failed to fetch file from S3: ${error}`);
  }
};

/**
 * Deletes a markdown file from S3
 * @param key The filename/key of the S3 object to delete
 */
export const deleteMarkdown = async (key: string): Promise<void> => {
  const params = {
    Bucket: bucketName,
    Key: `blog/${key}`
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('Error deleting from S3:', error);
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
  contentType: string
): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: `blog/images/${key}`,
    Body: buffer,
    ContentType: contentType,
    ACL: 'public-read'
  };

  try {
    const response = await s3.upload(params).promise();
    return response.Location;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw new Error(`Failed to upload image to S3: ${error}`);
  }
};