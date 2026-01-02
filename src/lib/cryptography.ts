const alg = "AES-GCM";

export async function encrypt(plainTextMessage: string, keyString: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const cryptoKey = await importKeyString(keyString);
  const encodedText = new TextEncoder().encode(plainTextMessage);

  const ciphertext = await crypto.subtle.encrypt(
    { name: alg, iv },
    cryptoKey,
    encodedText
  );

  const ciphertextBase64 = arrayBuffer2Base64(ciphertext);
  const ivBase64 = arrayBuffer2Base64(iv.buffer);

  return {
    ciphertextBase64,
    ivBase64,
  };
}

export async function decrypt(
  ciphertextBase64: string,
  ivBase64: string,
  keyBase64: string
) {
  const key = await importKeyString(keyBase64);
  const ciphertext = base642Uint8Array(ciphertextBase64);
  const iv = base642Uint8Array(ivBase64);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: alg, iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
}

export function base642Uint8Array(input: string) {
  // Uint8Array.fromBase64 Works on most browsers now
  // @ts-ignore
  return Uint8Array.fromBase64(input);
}

export function arrayBuffer2Base64(input: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(input)));
}

export function importKeyString(keyString: string) {
  // Uint8Array.fromBase64 Works on most browsers now
  // @ts-ignore
  const encodedKey = base642Uint8Array(keyString);
  return window.crypto.subtle.importKey("raw", encodedKey, alg, true, [
    "encrypt",
    "decrypt",
  ]);
}
