import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function handler(req, res) {
  try {
    const { filename } = req.query;

    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Cloudflare R2 client setup
    const client = new S3Client({
      region: "auto",
      endpoint: "https://86f9f3288260fc196c31fd33f8ae5139.r2.cloudflarestorage.com", // မင်း account endpoint
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
      },
    });

    // Upload command
    const command = new PutObjectCommand({
      Bucket: "maxflixstreaming", // မင်း bucket name
      Key: filename,
    });

    // Signed URL generate
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    res.status(200).json({ url });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
