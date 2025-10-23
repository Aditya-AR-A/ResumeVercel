"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { AssetDisplayMode, PortfolioAsset } from '@/types/interfaces';
import { resolveAssetUrl } from '@/utils/assets';
import {
  getEffectiveDisplayMode,
  isHtmlAsset,
  isImageAsset,
  isPdfAsset,
} from '@/utils/assetDisplay';

const SCROLLABLE_HEIGHT_CLASS = 'h-[28rem]';
const STATIC_HEIGHT_CLASS = 'h-[22rem]';
const DEFAULT_EMBED_ASPECT_RATIO = '16 / 9';

interface AssetPreviewProps {
  asset: PortfolioAsset;
  displayMode?: AssetDisplayMode;
}

const AssetPreview = ({ asset, displayMode }: AssetPreviewProps) => {
  const assetUrl = resolveAssetUrl(asset.file);
  const effectiveDisplayMode = getEffectiveDisplayMode(asset, displayMode);

  const embedContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!asset.embedCode || !embedContainerRef.current) {
      return;
    }

    const container = embedContainerRef.current;
    container.innerHTML = asset.embedCode;
    container.classList.add('tableau-responsive');

    const scriptNodes = Array.from(container.querySelectorAll('script'));
    scriptNodes.forEach((node) => {
      const replacement = document.createElement('script');
      Array.from(node.attributes).forEach((attr) => {
        replacement.setAttribute(attr.name, attr.value);
      });
      replacement.text = node.text;
      node.parentNode?.replaceChild(replacement, node);
    });

    const applyResponsiveSizing = () => {
      const responsiveTargets = container.querySelectorAll<HTMLElement>('.tableauPlaceholder, .tableauViz, .tableauPlaceholder > *');
      responsiveTargets.forEach((element) => {
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.maxWidth = '100%';
      });

      const embedElements = container.querySelectorAll<HTMLElement>('object, iframe, embed');
      embedElements.forEach((element) => {
        element.style.width = '100%';
        element.style.height = '100%';
        element.removeAttribute('width');
        element.removeAttribute('height');
      });
    };

    applyResponsiveSizing();
    const timeoutId = window.setTimeout(applyResponsiveSizing, 500);

    const observer = new MutationObserver(() => {
      applyResponsiveSizing();
    });

    observer.observe(container, {
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [asset.embedCode]);

  if (asset.embedCode) {
    const baseClasses = 'w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60';
    const wrapperClasses = effectiveDisplayMode === 'scrollable'
      ? `${SCROLLABLE_HEIGHT_CLASS} ${baseClasses}`
      : baseClasses;
    const wrapperStyle = effectiveDisplayMode === 'scrollable'
      ? undefined
      : { aspectRatio: DEFAULT_EMBED_ASPECT_RATIO };

    return (
      <div className={wrapperClasses} style={wrapperStyle}>
        <div ref={embedContainerRef} className="tableau-responsive h-full w-full" style={{ width: '100%' }} />
      </div>
    );
  }

  if (!assetUrl) {
    return null;
  }

  if (isHtmlAsset(asset)) {
    const baseClasses = 'w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60';
    const wrapperClasses = effectiveDisplayMode === 'scrollable'
      ? `${SCROLLABLE_HEIGHT_CLASS} ${baseClasses}`
      : baseClasses;
    const wrapperStyle = effectiveDisplayMode === 'scrollable'
      ? undefined
      : { aspectRatio: DEFAULT_EMBED_ASPECT_RATIO };

    return (
      <div className={wrapperClasses} style={wrapperStyle}>
        <iframe
          src={assetUrl}
          title={asset.title}
          loading="lazy"
          className="h-full w-full border-0"
          allowFullScreen
          scrolling={effectiveDisplayMode === 'scrollable' ? 'auto' : 'no'}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  if (isPdfAsset(asset)) {
    const wrapperClasses = `${SCROLLABLE_HEIGHT_CLASS} w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60`;

    return (
      <div className={wrapperClasses}>
        <iframe
          src={assetUrl}
          title={asset.title}
          loading="lazy"
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  if (isImageAsset(asset)) {
    return (
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 dark:border-white/10">
        <Image
          src={assetUrl}
          alt={asset.title}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1280px) 480px, 640px"
          className="object-cover"
          priority={false}
        />
      </div>
    );
  }

  return null;
};

export default AssetPreview;
