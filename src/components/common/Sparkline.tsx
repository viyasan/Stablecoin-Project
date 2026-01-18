interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  className?: string;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  color = '#0ea5e9',
  fillOpacity = 0.1,
  strokeWidth = 1.5,
  className = '',
}: SparklineProps) {
  if (!data || data.length < 2) {
    return null;
  }

  // Calculate min/max for scaling
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Add padding to prevent line from touching edges
  const paddingY = height * 0.1;
  const effectiveHeight = height - paddingY * 2;

  // Generate points for the polyline
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = paddingY + effectiveHeight - ((value - min) / range) * effectiveHeight;
    return `${x},${y}`;
  });

  // Create path for filled area
  const areaPath = `M0,${height} L${points.map((p, i) => (i === 0 ? p : ` L${p}`)).join('')} L${width},${height} Z`;

  // Determine if trend is positive (last value > first value)
  const isPositive = data[data.length - 1] >= data[0];
  const trendColor = isPositive ? '#22c55e' : '#ef4444';
  const finalColor = color === 'auto' ? trendColor : color;

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {/* Gradient fill under the line */}
      <defs>
        <linearGradient id={`sparkline-gradient-${finalColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={finalColor} stopOpacity={fillOpacity * 2} />
          <stop offset="100%" stopColor={finalColor} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Filled area */}
      <path
        d={areaPath}
        fill={`url(#sparkline-gradient-${finalColor.replace('#', '')})`}
      />

      {/* Line */}
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={finalColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* End dot */}
      <circle
        cx={width}
        cy={parseFloat(points[points.length - 1].split(',')[1])}
        r={2}
        fill={finalColor}
      />
    </svg>
  );
}
