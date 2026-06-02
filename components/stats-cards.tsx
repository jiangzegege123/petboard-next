import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatsCardData {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  descriptionColor?: string;
}

interface StatsCardsProps {
  cards: StatsCardData[];
  isLoading?: boolean;
  mobileGridCols?: number;
  desktopGridCols?: number;
}

const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export function StatsCards({ cards, isLoading, mobileGridCols = 1, desktopGridCols = 4 }: StatsCardsProps) {
  const mobileClass = gridColsMap[mobileGridCols] ?? 'grid-cols-1';
  const desktopClass = gridColsMap[desktopGridCols] ?? 'grid-cols-4';

  if (isLoading) {
    return (
      <div className={cn('grid gap-4', mobileClass, `md:${desktopClass}`)}>
        {Array.from({ length: cards.length }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', mobileClass, `md:${desktopClass}`)}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn('rounded-md p-2', card.iconBgColor ?? 'bg-muted')}>
                <Icon className={cn('h-4 w-4', card.iconColor ?? 'text-foreground')} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.description && (
                <p className={cn('text-xs mt-1', card.descriptionColor ?? 'text-muted-foreground')}>
                  {card.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
