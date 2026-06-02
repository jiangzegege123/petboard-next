import { Badge } from '@/components/ui/badge';
import { BADGE_COLORS } from '@/lib/utils';

interface TableBadgesProps {
  names: string[];
  visibleCount?: number;
}

export function TableBadges({ names, visibleCount = 2 }: TableBadgesProps) {
  const visible = names.slice(0, visibleCount);

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((name) => {
        const colorClass = BADGE_COLORS[name] ?? 'bg-gray-100 text-gray-800 border-gray-800';
        return (
          <Badge
            key={name}
            variant="outline"
            className={colorClass}
          >
            {name.replace(/_/g, ' ')}
          </Badge>
        );
      })}
    </div>
  );
}
