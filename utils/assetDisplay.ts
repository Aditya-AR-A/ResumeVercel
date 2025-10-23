import { AssetDisplayMode, PortfolioAsset } from '@/types/interfaces';

const HTML_TYPES = new Set(['html', 'plot', 'notebook', 'report', 'dashboard', 'tableau']);
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);
const IMAGE_TYPES = new Set(['image', 'thumbnail', 'logo']);
const PDF_EXTENSIONS = new Set(['pdf']);
const PDF_TYPES = new Set(['pdf', 'document']);
const DEFAULT_SCROLLABLE_TYPES = new Set(['notebook', 'html', 'document', 'report']);
const DEFAULT_SCROLLABLE_EXTS = new Set(['ipynb']);

export const getFileExtension = (asset: PortfolioAsset): string => {
  const filePath = asset.file || '';
  const queryIndex = filePath.indexOf('?');
  const sanitized = queryIndex >= 0 ? filePath.slice(0, queryIndex) : filePath;
  const dotIndex = sanitized.lastIndexOf('.');
  return dotIndex >= 0 ? sanitized.slice(dotIndex + 1).toLowerCase() : '';
};

export const isHtmlAsset = (asset: PortfolioAsset): boolean => {
  const type = (asset.type || '').toLowerCase();
  if (HTML_TYPES.has(type)) {
    return true;
  }
  const ext = getFileExtension(asset);
  return ext === 'html' || ext === 'htm';
};

export const isImageAsset = (asset: PortfolioAsset): boolean => {
  const type = (asset.type || '').toLowerCase();
  if (IMAGE_TYPES.has(type)) {
    return true;
  }
  const ext = getFileExtension(asset);
  return IMAGE_EXTENSIONS.has(ext);
};

export const isPdfAsset = (asset: PortfolioAsset): boolean => {
  const type = (asset.type || '').toLowerCase();
  if (PDF_TYPES.has(type)) {
    return true;
  }
  const ext = getFileExtension(asset);
  return PDF_EXTENSIONS.has(ext);
};

export const getEffectiveDisplayMode = (
  asset: PortfolioAsset,
  override?: AssetDisplayMode,
): AssetDisplayMode => {
  if (override) {
    return override;
  }

  if (asset.displayMode) {
    return asset.displayMode;
  }

  const type = (asset.type || '').toLowerCase();
  if (DEFAULT_SCROLLABLE_TYPES.has(type)) {
    return 'scrollable';
  }

  const ext = getFileExtension(asset);
  if (DEFAULT_SCROLLABLE_EXTS.has(ext)) {
    return 'scrollable';
  }

  return 'unscrollable';
};
