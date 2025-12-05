export function SimplePieChart({ data }: { data: Array<{ name: string; value: number; color: string }> }) {
  if (!data || data.length === 0) {
    return <div className="w-full h-64 flex items-center justify-center text-muted-foreground">No data available</div>;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  if (total === 0) {
    return <div className="w-full h-64 flex items-center justify-center text-muted-foreground">No data available</div>;
  }

  let currentAngle = 0;
  
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const sliceAngle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          
          const startX = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
          const startY = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
          const endX = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
          const endY = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const innerStartX = 100 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
          const innerStartY = 100 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
          const innerEndX = 100 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
          const innerEndY = 100 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
          
          const largeArc = sliceAngle > 180 ? 1 : 0;
          
          const path = `
            M ${String(innerStartX)} ${String(innerStartY)}
            L ${String(startX)} ${String(startY)}
            A 80 80 0 ${largeArc} 1 ${String(endX)} ${String(endY)}
            L ${String(innerEndX)} ${String(innerEndY)}
            A 40 40 0 ${largeArc} 0 ${String(innerStartX)} ${String(innerStartY)}
          `;
          
          currentAngle = endAngle;
          
          return (
            <path key={index} d={path} fill={item.color} stroke="white" strokeWidth="2" />
          );
        })}
      </svg>
    </div>
  );
}

export function SimpleLineChart({ data }: { data: Array<{ week: string; rate: number }> }) {
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>;
  }

  const maxRate = 100;
  const width = 400;
  const height = 200;
  const padding = 40;
  
  const xScale = data.length > 1 ? (width - 2 * padding) / (data.length - 1) : (width - 2 * padding) / 2;
  
  const points = data.map((item, index) => {
    const x = padding + index * xScale;
    const y = height - padding - (item.rate / maxRate) * (height - 2 * padding);
    return { x: Number.isFinite(x) ? x : 0, y: Number.isFinite(y) ? y : 0, ...item };
  });
  
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${String(p.x)} ${String(p.y)}`).join(' ');
  
  return (
    <div className="w-full h-48 flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = height - padding - (val / 100) * (height - 2 * padding);
          return (
            <g key={val}>
              <line x1={String(padding)} y1={String(y)} x2={String(width - padding)} y2={String(y)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
              <text x={String(padding - 10)} y={String(y + 4)} fontSize="12" textAnchor="end" fill="#6b7280">{val}%</text>
            </g>
          );
        })}
        {/* X axis */}
        <line x1={String(padding)} y1={String(height - padding)} x2={String(width - padding)} y2={String(height - padding)} stroke="#d1d5db" strokeWidth="2" />
        {/* Y axis */}
        <line x1={String(padding)} y1={String(padding)} x2={String(padding)} y2={String(height - padding)} stroke="#d1d5db" strokeWidth="2" />
        {/* Labels */}
        {points.map((p, i) => (
          <g key={`label-${i}`}>
            <text x={String(p.x)} y={String(height - padding + 20)} fontSize="12" textAnchor="middle" fill="#6b7280">{p.week}</text>
          </g>
        ))}
        {/* Line */}
        <path d={pathData} stroke="#3b82f6" strokeWidth="2" fill="none" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={`dot-${i}`} cx={String(p.x)} cy={String(p.y)} r="4" fill="#3b82f6" />
        ))}
      </svg>
    </div>
  );
}

export function SimpleBarChart({ data }: { data: Array<{ name: string; value: number }> }) {
  if (!data || data.length === 0) {
    return <div className="h-48 flex items-center justify-center text-muted-foreground">No data available</div>;
  }
  
  const maxValue = Math.max(...data.map(d => d.value || 0), 1);
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const value = Number.isFinite(item.value) ? item.value : 0;
        const percentage = (value / maxValue) * 100;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm gap-2">
              <span className="truncate">{item.name}</span>
              <span className="whitespace-nowrap">{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${Number.isFinite(percentage) ? percentage : 0}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
