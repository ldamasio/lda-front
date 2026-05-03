import { GetObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  endpoint: process.env.CONTABO_S3_ENDPOINT ?? "https://eu2.contabostorage.com",
  region: "default",
  credentials: {
    accessKeyId:
      process.env.CONTABO_S3_ACCESS_KEY ??
      process.env.AWS_ACCESS_KEY_ID ??
      "",
    secretAccessKey:
      process.env.CONTABO_S3_SECRET_KEY ??
      process.env.AWS_SECRET_ACCESS_KEY ??
      "",
  },
  forcePathStyle: true,
});

const BUCKET = process.env.CONTABO_S3_CONTENT_BUCKET ?? "rbx-content";
const NOTES_PREFIX = "lda/notes/";

export async function listNoteKeys(): Promise<string[]> {
  const res = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: NOTES_PREFIX })
  );

  return (res.Contents ?? [])
    .map((object) => object.Key ?? "")
    .filter((key) => key.endsWith(".mdx"));
}

export async function getNoteContent(key: string): Promise<string> {
  const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  return await res.Body!.transformToString();
}

export { NOTES_PREFIX };
