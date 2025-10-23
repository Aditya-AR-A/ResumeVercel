import Button from '@/components/Button';
import AssetPreview from '@/components/AssetPreview';
import { PortfolioAsset } from '@/types/interfaces';
import { resolveAssetUrl } from '@/utils/assets';
import { getEffectiveDisplayMode, isHtmlAsset } from '@/utils/assetDisplay';

interface AssetCardProps {
  asset: PortfolioAsset;
}

const AssetCard = ({ asset }: AssetCardProps) => {
  const assetUrl = resolveAssetUrl(asset.file);
  const previewMode = getEffectiveDisplayMode(asset);
  const htmlLike = isHtmlAsset(asset) || Boolean(asset.embedCode);
  const shouldRenderPreview = Boolean(asset.embedCode) || Boolean(assetUrl);
  const primaryLinkLabel = htmlLike && previewMode === 'unscrollable' ? 'Open Fullscreen' : 'View Asset';

  return (
    <article className="rounded-3xl border border-white/10 bg-white/10 p-5 dark:border-white/10 dark:bg-slate-900/40">
      <div className="space-y-4">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">
            {asset.title}
          </h4>
          {asset.description && (
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {asset.description}
            </p>
          )}
        </div>

        {shouldRenderPreview && <AssetPreview asset={asset} displayMode={previewMode} />}

        <div className="flex flex-wrap gap-3">
          {assetUrl && (
            <Button
              className="btn-secondary"
              href={assetUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {primaryLinkLabel}
            </Button>
          )}
          {asset.sourceUrl && (
            <Button
              className="btn-primary"
              href={asset.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source
            </Button>
          )}
        </div>

        {asset.automated && (
          <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300">
            Auto-synced
          </span>
        )}
      </div>
    </article>
  );
};

export default AssetCard;
