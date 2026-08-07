import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  try {
    const { filename } = req.query;

    const client = new S3Client({
      region: "auto",
      endpoint: "https://<accountid>.r2.cloudflarestorage.com",
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: "your-bucket-name",
      Key: filename,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
