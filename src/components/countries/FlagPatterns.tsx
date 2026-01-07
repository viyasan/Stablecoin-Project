export function FlagPatterns() {
  return (
    <defs>
      {/* United States Flag */}
      <pattern id="flag-us" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#B22234" />
        {/* White stripes */}
        {[1, 3, 5, 7, 9, 11].map((i) => (
          <rect key={i} y={`${(i * 100) / 13}%`} width="100%" height={`${100 / 13}%`} fill="#FFFFFF" />
        ))}
        {/* Blue canton */}
        <rect width="40%" height={`${(7 * 100) / 13}%`} fill="#3C3B6E" />
        {/* Stars (simplified 5x4 + 4x5 grid) */}
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2, 3, 4, 5].map((col) => (
            <circle
              key={`star-${row}-${col}`}
              cx={`${3 + col * 6}%`}
              cy={`${4 + row * 8}%`}
              r="1.2%"
              fill="#FFFFFF"
            />
          ))
        )}
      </pattern>

      {/* European Union Flag */}
      <pattern id="flag-eu" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#003399" />
        {/* 12 gold stars in circle */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const cx = 50 + 30 * Math.cos(angle);
          const cy = 50 + 30 * Math.sin(angle);
          return (
            <g key={i} transform={`translate(${cx}, ${cy})`}>
              <polygon
                points="0,-8 2.3,-2.5 8,-2.5 3.5,1.5 5.5,8 0,4 -5.5,8 -3.5,1.5 -8,-2.5 -2.3,-2.5"
                fill="#FFCC00"
                transform="scale(0.5)"
              />
            </g>
          );
        })}
      </pattern>

      {/* United Kingdom Flag */}
      <pattern id="flag-uk" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#012169" />
        {/* White diagonals */}
        <polygon points="0,0 100,60 100,70 0,10" fill="#FFFFFF" />
        <polygon points="0,60 0,70 100,10 100,0" fill="#FFFFFF" />
        {/* Red diagonals */}
        <polygon points="0,0 50,30 50,35 0,5" fill="#C8102E" />
        <polygon points="100,60 50,30 50,25 100,55" fill="#C8102E" />
        <polygon points="0,60 0,55 50,30 50,35" fill="#C8102E" />
        <polygon points="100,0 100,5 50,30 50,25" fill="#C8102E" />
        {/* White cross */}
        <rect x="42%" width="16%" height="100%" fill="#FFFFFF" />
        <rect y="40%" width="100%" height="20%" fill="#FFFFFF" />
        {/* Red cross */}
        <rect x="45%" width="10%" height="100%" fill="#C8102E" />
        <rect y="43%" width="100%" height="14%" fill="#C8102E" />
      </pattern>

      {/* Singapore Flag */}
      <pattern id="flag-sg" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="50%" fill="#ED2939" />
        <rect y="50%" width="100%" height="50%" fill="#FFFFFF" />
        {/* Crescent moon */}
        <circle cx="22%" cy="25%" r="12%" fill="#FFFFFF" />
        <circle cx="26%" cy="25%" r="10%" fill="#ED2939" />
        {/* 5 stars */}
        <circle cx="35%" cy="15%" r="2%" fill="#FFFFFF" />
        <circle cx="42%" cy="20%" r="2%" fill="#FFFFFF" />
        <circle cx="42%" cy="30%" r="2%" fill="#FFFFFF" />
        <circle cx="35%" cy="35%" r="2%" fill="#FFFFFF" />
        <circle cx="38.5%" cy="25%" r="2.5%" fill="#FFFFFF" />
      </pattern>

      {/* Japan Flag */}
      <pattern id="flag-jp" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#FFFFFF" />
        <circle cx="50%" cy="50%" r="20%" fill="#BC002D" />
      </pattern>

      {/* Canada Flag */}
      <pattern id="flag-ca" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="25%" height="100%" fill="#FF0000" />
        <rect x="25%" width="50%" height="100%" fill="#FFFFFF" />
        <rect x="75%" width="25%" height="100%" fill="#FF0000" />
        {/* Maple leaf (simplified) */}
        <path
          d="M50,20 L52,30 L62,30 L54,38 L57,50 L50,44 L43,50 L46,38 L38,30 L48,30 Z"
          fill="#FF0000"
          transform="translate(0, 5)"
        />
      </pattern>

      {/* UAE Flag */}
      <pattern id="flag-ae" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="25%" height="100%" fill="#00732F" />
        <rect x="25%" width="75%" height="33.33%" fill="#00732F" />
        <rect x="25%" y="33.33%" width="75%" height="33.33%" fill="#FFFFFF" />
        <rect x="25%" y="66.66%" width="75%" height="33.34%" fill="#000000" />
        <rect width="25%" height="100%" fill="#FF0000" />
      </pattern>

      {/* Hong Kong Flag */}
      <pattern id="flag-hk" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#DE2910" />
        {/* Bauhinia flower (simplified as 5 petals) */}
        {[0, 72, 144, 216, 288].map((angle, i) => (
          <ellipse
            key={i}
            cx="50%"
            cy="35%"
            rx="8%"
            ry="18%"
            fill="#FFFFFF"
            transform={`rotate(${angle}, 50, 50)`}
          />
        ))}
        <circle cx="50%" cy="50%" r="8%" fill="#DE2910" />
      </pattern>

      {/* Switzerland Flag */}
      <pattern id="flag-ch" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#FF0000" />
        {/* White cross */}
        <rect x="38%" y="20%" width="24%" height="60%" fill="#FFFFFF" />
        <rect x="20%" y="38%" width="60%" height="24%" fill="#FFFFFF" />
      </pattern>

      {/* Australia Flag */}
      <pattern id="flag-au" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#00008B" />
        {/* Union Jack in canton (simplified) */}
        <rect width="50%" height="50%" fill="#012169" />
        <rect x="20%" width="10%" height="50%" fill="#FFFFFF" />
        <rect y="20%" width="50%" height="10%" fill="#FFFFFF" />
        <rect x="22%" width="6%" height="50%" fill="#C8102E" />
        <rect y="22%" width="50%" height="6%" fill="#C8102E" />
        {/* Commonwealth Star */}
        <circle cx="25%" cy="75%" r="5%" fill="#FFFFFF" />
        {/* Southern Cross (simplified) */}
        <circle cx="85%" cy="25%" r="2.5%" fill="#FFFFFF" />
        <circle cx="75%" cy="50%" r="2.5%" fill="#FFFFFF" />
        <circle cx="85%" cy="75%" r="2.5%" fill="#FFFFFF" />
        <circle cx="95%" cy="55%" r="2%" fill="#FFFFFF" />
        <circle cx="80%" cy="65%" r="3%" fill="#FFFFFF" />
      </pattern>

      {/* Neutral/Gray pattern for non-highlighted countries */}
      <pattern id="flag-neutral" patternUnits="objectBoundingBox" width="1" height="1">
        <rect width="100%" height="100%" fill="#E5E7EB" />
      </pattern>
    </defs>
  );
}

// Map country ID to pattern ID
export function getFlagPatternId(countryId: string): string {
  return `flag-${countryId}`;
}
