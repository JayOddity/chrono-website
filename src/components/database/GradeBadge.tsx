const gradeColors: Record<string, string> = {
  Common: 'text-grade-common',
  Uncommon: 'text-grade-uncommon',
  Rare: 'text-grade-rare',
  Epic: 'text-grade-epic',
  Legendary: 'text-grade-legendary',
};

const gradeBgColors: Record<string, string> = {
  Common: 'bg-grade-common/15 border-grade-common/30',
  Uncommon: 'bg-grade-uncommon/15 border-grade-uncommon/30',
  Rare: 'bg-grade-rare/15 border-grade-rare/30',
  Epic: 'bg-grade-epic/15 border-grade-epic/30',
  Legendary: 'bg-grade-legendary/15 border-grade-legendary/30',
};

export function gradeTextColor(grade: string): string {
  return gradeColors[grade] || 'text-text-muted';
}

export default function GradeBadge({ grade }: { grade: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${gradeBgColors[grade] || ''} ${gradeColors[grade] || 'text-text-muted'}`}
    >
      {grade}
    </span>
  );
}
