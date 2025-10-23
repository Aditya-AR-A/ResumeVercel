const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '');

const assetHostBase = (() => {
  const fromEnv = process.env.NEXT_PUBLIC_ASSET_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  const fallback = process.env.NODE_ENV === 'production'
    ? 'https://resume-backend-8uzi.onrender.com'
    : 'http://localhost:8000';
  return trimTrailingSlash(fromEnv || fallback);
})();

const assetPathPrefix = (() => {
  const prefix = process.env.NEXT_PUBLIC_ASSET_PATH || 'assets';
  return trimSlashes(prefix);
})();

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value);

function buildPath(segments: string[]) {
  return segments.map(trimSlashes).filter(Boolean).join('/');
}

export function getAssetUrl(...segments: string[]) {
  const pathSegments = [assetPathPrefix, ...segments];
  const normalizedPath = buildPath(pathSegments);
  return `${assetHostBase}/${normalizedPath}`;
}

export function resolveAssetUrl(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  const normalized = trimSlashes(value);
  if (normalized.startsWith(assetPathPrefix)) {
    return `${assetHostBase}/${normalized}`;
  }

  return getAssetUrl(normalized);
}

export const ASSET_BASE_ORIGIN = assetHostBase;
export const ASSET_PATH_PREFIX = assetPathPrefix;
