// lib/utils/encryption.ts
import crypto from "crypto";

const KEY_B64 = process.env.MASTER_ENCRYPTION_KEY_B64;
if (!KEY_B64) {
  throw new Error("MASTER_ENCRYPTION_KEY_B64 env var must be set (base64-encoded 32 bytes)");
}
const KEY = Buffer.from(KEY_B64, "base64");
if (KEY.length !== 32) {
  throw new Error("MASTER_ENCRYPTION_KEY_B64 must decode to 32 bytes (256 bits)");
}

export function encryptPlaintext(plaintext: string) {
  // AES-256-GCM, 12 byte iv recommended
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    algo: "aes-256-gcm",
  };
}

export function decryptToPlaintext({
  ciphertext,
  iv,
  tag,
}: {
  ciphertext: string;
  iv: string;
  tag: string;
}) {
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
