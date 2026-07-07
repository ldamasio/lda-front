import { createHash, createHmac } from 'node:crypto';

const CONTABO_ENDPOINT = process.env.CONTABO_S3_ENDPOINT ?? 'https://eu2.contabostorage.com';
const CONTABO_BUCKET = process.env.CONTABO_S3_CONTENT_BUCKET ?? 'rbx-content';
const CONTABO_ACCESS_KEY = process.env.CONTABO_S3_ACCESS_KEY ?? process.env.AWS_ACCESS_KEY_ID;
const CONTABO_SECRET_KEY = process.env.CONTABO_S3_SECRET_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;
const CONTABO_REGION = 'default';

function hashHex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function hmac(key: string | Buffer, value: string): Buffer {
  return createHmac('sha256', key).update(value, 'utf8').digest();
}

function amzDate(now = new Date()): string {
  return now.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

function credentialScope(dateStamp: string): string {
  return `${dateStamp}/${CONTABO_REGION}/s3/aws4_request`;
}

function encodeObjectKey(key: string): string {
  return key.split('/').map((part) => encodeURIComponent(part)).join('/');
}

function signingKey(secretKey: string, dateStamp: string): Buffer {
  const kDate = hmac(`AWS4${secretKey}`, dateStamp);
  const kRegion = hmac(kDate, CONTABO_REGION);
  const kService = hmac(kRegion, 's3');
  return hmac(kService, 'aws4_request');
}

export function contaboObjectUrl(key: string): string {
  return `${CONTABO_ENDPOINT.replace(/\/$/, '')}/${CONTABO_BUCKET}/${encodeObjectKey(key)}`;
}

export async function readContaboObject(key: string): Promise<string | null> {
  if (!CONTABO_ACCESS_KEY || !CONTABO_SECRET_KEY) {
    return null;
  }

  const url = contaboObjectUrl(key);
  const now = new Date();
  const amz = amzDate(now);
  const dateStamp = amz.slice(0, 8);
  const host = new URL(CONTABO_ENDPOINT).host;
  const payloadHash = hashHex('');
  const canonicalUri = `/${CONTABO_BUCKET}/${encodeObjectKey(key)}`;
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amz}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
  const canonicalRequest = [
    'GET',
    canonicalUri,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amz,
    credentialScope(dateStamp),
    hashHex(canonicalRequest),
  ].join('\n');
  const signature = createHmac('sha256', signingKey(CONTABO_SECRET_KEY, dateStamp))
    .update(stringToSign, 'utf8')
    .digest('hex');

  const response = await fetch(url, {
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${CONTABO_ACCESS_KEY}/${credentialScope(dateStamp)}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amz,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await response.text();
}
