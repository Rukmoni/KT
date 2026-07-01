interface TokenMeterProps {
  totalCost: number;
  totalTokens: number;
  cacheHit?: boolean;
  lastCost?: number;
}

export function TokenMeterShadow({ totalCost, totalTokens, cacheHit, lastCost }: TokenMeterProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-mentor-navy/5 border border-mentor-border text-xs text-mentor-muted">
      <span className="font-mono">{totalTokens.toLocaleString()} tok</span>
      <span className="w-px h-3 bg-mentor-border" />
      <span className="font-mono">${totalCost.toFixed(4)}</span>
      {lastCost !== undefined && lastCost > 0 && (
        <>
          <span className="w-px h-3 bg-mentor-border" />
          <span className="font-mono text-mentor-amber">+${lastCost.toFixed(4)}</span>
        </>
      )}
      {cacheHit && (
        <>
          <span className="w-px h-3 bg-mentor-border" />
          <span className="text-mentor-sage font-medium">⚡ cached</span>
        </>
      )}
    </div>
  );
}
