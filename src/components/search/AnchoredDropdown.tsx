"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

const VIEWPORT_PADDING = 16;
const ANCHOR_GAP = 8;
const OUTSIDE_CLICK_GUARD_MS = 0;

export interface AnchoredDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  align: "left" | "right";
  anchorRef: RefObject<HTMLElement | null>;
  minPanelWidth?: number;
  children: ReactNode;
}

type PanelPosition = {
  top: number;
  left: number;
  width: number;
};

function getScrollParents(node: HTMLElement | null): HTMLElement[] {
  const parents: HTMLElement[] = [];

  if (typeof window === "undefined" || !node) {
    return parents;
  }

  let parent = node.parentElement;

  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflow = `${style.overflow}${style.overflowY}${style.overflowX}`;

    if (/(auto|scroll|overlay)/.test(overflow)) {
      parents.push(parent);
    }

    parent = parent.parentElement;
  }

  if (!parents.includes(document.documentElement)) {
    parents.push(document.documentElement);
  }

  return parents;
}

function computePanelPosition(
  anchorRect: DOMRect,
  align: "left" | "right",
  minPanelWidth: number,
  panelHeight = 0,
): PanelPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxWidth = Math.min(
    320,
    Math.max(minPanelWidth, viewportWidth - VIEWPORT_PADDING * 2),
  );
  const width = Math.min(
    maxWidth,
    Math.max(anchorRect.width, minPanelWidth, 260),
  );

  let left =
    align === "right" ? anchorRect.right - width : anchorRect.left;

  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, viewportWidth - width - VIEWPORT_PADDING),
  );

  const spaceBelow = viewportHeight - anchorRect.bottom - ANCHOR_GAP;
  const spaceAbove = anchorRect.top - ANCHOR_GAP;
  const preferAbove =
    panelHeight > 0 &&
    panelHeight > spaceBelow &&
    spaceAbove >= panelHeight;

  let top = preferAbove
    ? anchorRect.top - ANCHOR_GAP - panelHeight
    : anchorRect.bottom + ANCHOR_GAP;

  if (panelHeight > 0) {
    top = Math.max(
      VIEWPORT_PADDING,
      Math.min(top, viewportHeight - panelHeight - VIEWPORT_PADDING),
    );
  }

  return {
    top,
    left,
    width,
  };
}

function positionsEqual(a: PanelPosition, b: PanelPosition) {
  return a.top === b.top && a.left === b.left && a.width === b.width;
}

export function AnchoredDropdown({
  isOpen,
  onClose,
  align,
  anchorRef,
  minPanelWidth = 300,
  children,
}: AnchoredDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const openedAtRef = useRef(0);
  const panelHeightRef = useRef(0);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;

    if (!anchor) {
      return;
    }

    const next = computePanelPosition(
      anchor.getBoundingClientRect(),
      align,
      minPanelWidth,
      panelHeightRef.current,
    );

    setPosition((prev) => {
      if (prev && positionsEqual(prev, next)) {
        return prev;
      }

      return next;
    });
  }, [align, anchorRef, minPanelWidth]);

  useLayoutEffect(() => {
    if (!isOpen) {
      panelHeightRef.current = 0;
      setPosition(null);
      return;
    }

    openedAtRef.current = performance.now();
    updatePosition();
  }, [isOpen, updatePosition]);

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) {
      return;
    }

    const panel = panelRef.current;

    const measureAndUpdate = () => {
      panelHeightRef.current = panel.getBoundingClientRect().height;
      updatePosition();
    };

    measureAndUpdate();

    const resizeObserver = new ResizeObserver(measureAndUpdate);
    resizeObserver.observe(panel);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, updatePosition, position?.width]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const anchor = anchorRef.current;
    const scrollParents = getScrollParents(anchor);
    const handleScrollOrResize = () => {
      updatePosition();
    };

    scrollParents.forEach((element) => {
      element.addEventListener("scroll", handleScrollOrResize, { passive: true });
    });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      scrollParents.forEach((element) => {
        element.removeEventListener("scroll", handleScrollOrResize);
      });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [anchorRef, isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDownCapture = (event: PointerEvent) => {
      if (performance.now() - openedAtRef.current < OUTSIDE_CLICK_GUARD_MS) {
        return;
      }

      const target = event.target as Node;

      if (panelRef.current?.contains(target)) {
        return;
      }

      if (anchorRef.current?.contains(target)) {
        return;
      }

      onCloseRef.current();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    document.addEventListener("pointerdown", handlePointerDownCapture, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDownCapture, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [anchorRef, isOpen]);

  if (!mounted || !isOpen || position == null) {
    return null;
  }

  const style: CSSProperties = {
    position: "fixed",
    top: position.top,
    left: position.left,
    width: position.width,
    zIndex: 70,
  };

  return createPortal(
    <div
      ref={panelRef}
      style={style}
      className="min-w-[260px] max-w-[min(320px,calc(100vw-2rem))] overflow-visible"
    >
      {children}
    </div>,
    document.body,
  );
}
