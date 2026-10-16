import React from 'react';
import { CompetencyVector } from '../../types/study';
import { Target, Sparkles, Award } from 'lucide-react';

interface SkillRadarChartProps {
  competencies: CompetencyVector;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ competencies }) => {
  const size = 260;
  const center = size / 2;
  const radius = 95;

  const dimensions = [
    { key: 'computerScience', label: 'CompSci', value: competencies.computerScience },
    { key: 'cognitiveScience', label: 'CogSci', value: competencies.cognitiveScience },
    { key: 'marineEcology', label: 'Ecology', value: competencies.marineEcology },
    { key: 'systemsArchitecture', label: 'Systems', value: competencies.systemsArchitecture },
    { key: 'researchMethodology', label: 'Research', value: competencies.researchMethodology }
  ];

  const totalAxes = dimensions.length;

  // Compute point for a given axis index and value (0 - 100)
  const getCoordinates = (index: number, val: number) => {
    const angle = (index * 2 * Math.PI) / totalAxes - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Build SVG polygon points
  const polygonPoints = dimensions
    .map((dim, idx) => {
      const { x, y } = getCoordinates(idx, dim.value);
      return `${x},${y}`;
    })
    .join(' ');

  // Average competency
  const avgCompetency = Math.round(
    dimensions.reduce((acc, d) => acc + d.value, 0) / dimensions.length
  );

  return (
    <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 font-mono">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-300">
        <span className="flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-emerald-400" />
          <span>Competency Skill Radar</span>
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-emerald-400">
          {avgCompetency}% Avg Mastery
        </span>
      </div>

      {/* SVG Spider Radar */}
      <div className="relative flex items-center justify-center py-2">
        <svg width={size} height={size} className="overflow-visible">
          {/* Concentric Reference Rings */}
          {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
            const ringPoints = dimensions
              .map((_, idx) => {
                const angle = (idx * 2 * Math.PI) / totalAxes - Math.PI / 2;
                const r = radius * scale;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(' ');

            return (
              <polygon
                key={sIdx}
                points={ringPoints}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Radial Axis Spokes */}
          {dimensions.map((_, idx) => {
            const angle = (idx * 2 * Math.PI) / totalAxes - Math.PI / 2;
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);

            return (
              <line
                key={idx}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1"
              />
            );
          })}

          {/* Value Polygon with Emerald/Cyan Glow */}
          <polygon
            points={polygonPoints}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Vertex Dots */}
          {dimensions.map((dim, idx) => {
            const { x, y } = getCoordinates(idx, dim.value);
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="3.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Axis Labels */}
          {dimensions.map((dim, idx) => {
            const angle = (idx * 2 * Math.PI) / totalAxes - Math.PI / 2;
            const labelRadius = radius + 22;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);

            return (
              <text
                key={idx}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fill="#a3a3a3"
                fontFamily="monospace"
              >
                {dim.label} {dim.value}%
              </text>
            );
          })}
        </svg>
      </div>

      <div className="text-[10px] text-neutral-400 text-center font-sans">
        Competency polygon expands automatically upon completing courses and passing capstone practice exams.
      </div>
    </div>
  );
};
