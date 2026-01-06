"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Placement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: Placement;
  offset?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function Tooltip({
  content,
  children,
  placement = "top",
  offset = 8,
  open,
  onOpenChange,
  className,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (onOpenChange) onOpenChange(next);
      else setInternalOpen(next);
    },
    [onOpenChange]
  );

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let top = 0;
    let left = 0;

    if (placement === "top") {
      top = rect.top - offset;
      left = rect.left + rect.width / 2;
    } else if (placement === "bottom") {
      top = rect.bottom + offset;
      left = rect.left + rect.width / 2;
    } else if (placement === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - offset;
    } else {
      top = rect.top + rect.height / 2;
      left = rect.right + offset;
    }

    const margin = 12;
    const clampedTop = clamp(top, margin, vh - margin);
    const clampedLeft = clamp(left, margin, vw - margin);
    setCoords({ top: clampedTop, left: clampedLeft });
  }, [placement, offset]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;
    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const onMouseEnter = () => setOpen(true);
  const onMouseLeave = () => setOpen(false);
  const onFocus = () => setOpen(true);
  const onBlur = () => setOpen(false);

  const tooltipNode = isOpen && coords ? (
    <div
      role="tooltip"
      className={
        "fixed z-50 origin-center rounded-lg px-3 py-2 text-sm shadow-tooltip " +
        "bg-slate-900/95 text-white backdrop-blur " +
        "ring-1 ring-white/10 " +
        "transition-opacity duration-150 " +
        (className || "")
      }
      style={{
        top: coords.top,
        left: coords.left,
        transform: placement === "top" || placement === "bottom" ? "translate(-50%, 0)" : "translate(0, -50%)",
      }}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        ref={(node) => {
          triggerRef.current = node;
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-expanded={isOpen}
        className="inline-flex items-center"
      >
        {children}
      </button>
      {mounted && tooltipNode ? createPortal(tooltipNode, document.body) : null}
    </>
  );
}

