
import AWS from 'aws-sdk';

// Configure AWS with your credentials
AWS.config.update({
  accessKeyId: 'AKIASR5LGLHNOSXQDVAC',
  secretAccessKey: 'MrXBImGq3bIWyqJJeO0iEZVpEKqbtqyZmD9ayiSg',
  region: 'ap-southeast-2', // e.g., 'us-east-1'
});


const s3 = new AWS.S3();

export async function fetchJsonFromS3(bucket: string, key: string): Promise<any> {
  const params = {
    Bucket: bucket,
    Key: key, 
  };

  try {
    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body?.toString() || '');
  } catch (error) {
    console.error('Error fetching JSON from S3:', error);
    throw error;
  }
}

export default s3;
