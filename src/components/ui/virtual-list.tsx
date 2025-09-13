"use client";

import { useCallback, useMemo, useRef, useState } from "react";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number; // fixed row height
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function VirtualList<T>({ items, itemHeight, overscan = 5, renderItem, className, style }: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const height = (style?.height as number) || 400;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + height) / itemHeight) + overscan);

  const visibleItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div ref={containerRef} onScroll={onScroll} className={className} style={{ ...style, overflowY: "auto", position: "relative" }}>
      <div style={{ height: totalHeight }} />
      <div style={{ position: "absolute", top: startIndex * itemHeight, left: 0, right: 0 }}>
        {visibleItems.map((item, i) => (
          <div key={startIndex + i} style={{ height: itemHeight }}>
            {renderItem(item, startIndex + i)}
          </div>
        ))}
      </div>
    </div>
  );
}



