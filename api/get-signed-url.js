export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // အကုန်ခွင့်
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { filename } = req.query;
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }

    // Cloudflare R2 client setup
    const client = new S3Client({
      region: "auto",
      endpoint: "https://86f9f3288260fc196c31fd33f8ae5139.r2.cloudflarestorage.com",
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY,
        secretAccessKey: process.env.R2_SECRET_KEY,
      },
    });

    const command = new PutObjectCommand({
      Bucket: "maxflixstreaming",
      Key: filename,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });
    res.status(200).json({ url });
  } catch (err) {
    console.error("Signed URL error:", err);
    res.status(500).json({ error: "Failed to generate signed URL" });
  }
}
