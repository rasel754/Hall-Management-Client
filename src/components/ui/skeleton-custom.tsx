import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 rounded-xl border border-border p-4 bg-card w-full shadow-sm">
      <Skeleton className="h-[125px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-4 rounded-xl border border-border p-4 bg-card shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="flex space-x-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton
                key={cIdx}
                className="h-6 flex-1 rounded"
                style={{
                  opacity: 1 - (rIdx * 0.1), // gradient effect on lines
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
