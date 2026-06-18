import * as ed from '@noble/ed25519';

export const TOKEN_PREFIX = 'PT1';
export const DEFAULT_BUILD_CONSTRAINT = '1.0.0+1';
export const DEFAULT_DURATION_DAYS = 14;
export const DEFAULT_STATION_LIMIT = 10;
export const DEFAULT_SIGNATURE_VERSION = 1;

// ─── Base64Url helpers ────────────────────────────────────────────────────────

export function b64urlEncode(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function b64urlDecode(str) {
  str = str.trim().replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Converts a Date to ISO 8601 UTC with microsecond precision (6 decimal places),
 * matching Python's datetime.isoformat(timespec="microseconds").
 */
export function isoUtc(date) {
  return date.toISOString().replace(/\.(\d{3})Z$/, '.$1000Z');
}

/** `datetime-local` value (YYYY-MM-DDTHH:mm) in local timezone */
export function toDatetimeLocalValue(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function defaultExpiresAtLocal(days = DEFAULT_DURATION_DAYS) {
  const d = new Date();
  d.setDate(d.getDate() + Number(days));
  return toDatetimeLocalValue(d);
}

/**
 * Resolves license end date from explicit datetime or duration in days.
 */
export function resolveExpiresAt({ durationDays, startsAt, expiresAt }) {
  const now = new Date();
  const startsAtDate = startsAt ? new Date(startsAt) : now;

  if (expiresAt) {
    const expiresAtDate = new Date(expiresAt);
    if (Number.isNaN(expiresAtDate.getTime())) {
      throw new Error('تاريخ الانتهاء غير صالح');
    }
    return { startsAtDate, expiresAtDate };
  }

  if (!durationDays || Number(durationDays) < 1) {
    throw new Error('مدة التفعيل يجب أن تكون يوماً واحداً على الأقل');
  }

  const expiresAtDate = new Date(
    startsAtDate.getTime() + Number(durationDays) * 24 * 60 * 60 * 1000
  );
  return { startsAtDate, expiresAtDate };
}

// ─── Payload builder ──────────────────────────────────────────────────────────

function buildPayloadObject({
  shopName,
  planType,
  issuedAt,
  startsAt,
  expiresAt,
  installationId,
  deviceHintsHash,
  stationLimit,
  buildConstraint,
  signatureVersion,
}) {
  // Key order MUST match the Python implementation for signature compatibility.
  return {
    shopName,
    planType,
    issuedAtUtc: isoUtc(issuedAt),
    startsAtUtc: isoUtc(startsAt),
    expiresAtUtc: isoUtc(expiresAt),
    installationId,
    deviceHintsHash,
    stationLimit: Number(stationLimit),
    buildConstraint: buildConstraint || null,
    signatureVersion: Number(signatureVersion),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Derives the public key from a Base64Url-encoded private key (32 raw bytes).
 */
export async function derivePublicKey(privateKeyB64) {
  const bytes = b64urlDecode(privateKeyB64);
  if (bytes.length !== 32) {
    throw new Error(
      `المفتاح الخاص يجب أن يكون 32 بايت، الموجود: ${bytes.length} بايت`
    );
  }
  const pubBytes = await ed.getPublicKeyAsync(bytes);
  return b64urlEncode(pubBytes);
}

/**
 * Generates a new Ed25519 key pair.
 */
export async function generateKeyPair() {
  const privateKeyBytes = ed.utils.randomPrivateKey();
  const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes);
  return {
    privateKeyB64: b64urlEncode(privateKeyBytes),
    publicKeyB64: b64urlEncode(publicKeyBytes),
  };
}

/**
 * Generates a signed license token.
 *
 * @param {Object} params
 * @param {string}  params.privateKeyB64
 * @param {string}  params.shopName
 * @param {string}  params.planType        "trial" | "subscription"
 * @param {string}  params.installationId
 * @param {string}  params.deviceHintsHash
 * @param {number=} params.durationDays    used when expiresAt is omitted
 * @param {string=} params.expiresAt       datetime-local or ISO (optional; overrides durationDays)
 * @param {number}  params.stationLimit
 * @param {string=} params.startsAt        ISO date string (optional, default = now)
 * @param {string=} params.issuedAt        ISO date string (optional, default = now)
 * @param {string=} params.buildConstraint (optional, default = "1.0.0+1")
 * @param {number=} params.signatureVersion (optional, default = 1)
 */
export async function generateToken({
  privateKeyB64,
  shopName,
  planType,
  installationId,
  deviceHintsHash,
  durationDays,
  expiresAt,
  stationLimit,
  startsAt,
  issuedAt,
  buildConstraint,
  signatureVersion,
}) {
  const privateKeyBytes = b64urlDecode(privateKeyB64);
  if (privateKeyBytes.length !== 32) {
    throw new Error(
      `المفتاح الخاص غير صالح. يجب أن يكون 32 بايت بعد فك Base64Url، الموجود: ${privateKeyBytes.length} بايت`
    );
  }

  const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes);
  const publicKeyB64 = b64urlEncode(publicKeyBytes);

  const now = new Date();
  const issuedAtDate = issuedAt ? new Date(issuedAt) : now;
  const { startsAtDate, expiresAtDate } = resolveExpiresAt({
    durationDays,
    startsAt,
    expiresAt,
  });

  const payload = buildPayloadObject({
    shopName,
    planType,
    issuedAt: issuedAtDate,
    startsAt: startsAtDate,
    expiresAt: expiresAtDate,
    installationId,
    deviceHintsHash,
    stationLimit,
    buildConstraint: buildConstraint || null,
    signatureVersion: signatureVersion || DEFAULT_SIGNATURE_VERSION,
  });

  // Canonical JSON: no spaces, key order preserved (insertion order in V8).
  const payloadJson = JSON.stringify(payload);
  const payloadBytes = new TextEncoder().encode(payloadJson);
  const signature = await ed.signAsync(payloadBytes, privateKeyBytes);

  const token = `${TOKEN_PREFIX}.${b64urlEncode(payloadBytes)}.${b64urlEncode(signature)}`;
  const buildValue = buildConstraint || DEFAULT_BUILD_CONSTRAINT;
  const flutterCommand =
    `flutter run ` +
    `--dart-define=LICENSE_PUBLIC_KEY_B64=${publicKeyB64} ` +
    `--dart-define=APP_BUILD=${buildValue}`;

  return {
    token,
    publicKeyB64,
    payload,
    payloadJson: JSON.stringify(payload, null, 2),
    flutterCommand,
  };
}

/**
 * Decodes a PT1 token and returns its payload (does NOT verify the signature).
 */
/**
 * Preview expiry from duration and optional start date.
 */
export function previewLicenseDates({ durationDays, startsAt, issuedAt, expiresAt }) {
  const now = new Date();
  const issuedAtDate = issuedAt ? new Date(issuedAt) : now;
  const { startsAtDate, expiresAtDate } = resolveExpiresAt({
    durationDays,
    startsAt,
    expiresAt,
  });
  const msLeft = expiresAtDate - now;
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
  return {
    startsAtDate,
    issuedAtDate,
    expiresAtDate,
    daysLeft,
    hoursLeft,
    isExpired: expiresAtDate < now,
  };
}

/**
 * Verifies Ed25519 signature on a PT1 token (optional public key).
 */
export async function verifyTokenSignature(token, publicKeyB64) {
  const parts = token.trim().split('.');
  if (parts.length !== 3 || parts[0] !== TOKEN_PREFIX) {
    throw new Error('صيغة التوكن غير صحيحة');
  }
  const payloadBytes = b64urlDecode(parts[1]);
  const signatureBytes = b64urlDecode(parts[2]);
  const pubBytes = b64urlDecode(publicKeyB64);
  if (pubBytes.length !== 32) {
    throw new Error('المفتاح العام غير صالح (يجب 32 بايت)');
  }
  const valid = await ed.verifyAsync(signatureBytes, payloadBytes, pubBytes);
  return { valid, payloadBytes };
}

export function decodeToken(token) {
  const parts = token.trim().split('.');

  if (parts.length !== 3) {
    throw new Error(
      'صيغة التوكن غير صحيحة. يجب أن يتكون من 3 أجزاء مفصولة بنقطة (.)'
    );
  }

  if (parts[0] !== TOKEN_PREFIX) {
    throw new Error(
      `بادئة التوكن غير صحيحة. المتوقع: "${TOKEN_PREFIX}"، الموجود: "${parts[0]}"`
    );
  }

  let payload;
  try {
    const payloadBytes = b64urlDecode(parts[1]);
    const payloadJson = new TextDecoder().decode(payloadBytes);
    payload = JSON.parse(payloadJson);
  } catch (e) {
    throw new Error(`فشل فك تشفير التوكن: ${e.message}`);
  }

  return {
    prefix: parts[0],
    payload,
    payloadJson: JSON.stringify(payload, null, 2),
    signatureB64: parts[2],
  };
}
