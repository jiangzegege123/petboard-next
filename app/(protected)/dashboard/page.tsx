'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarCheck, CalendarX, Home, CalendarDays } from 'lucide-react';
import { StatsCards, StatsCardData } from '@/components/stats-cards';
import { DashboardStatsQueryOptions, BoardedPetsQueryOptions } from '@/lib/api/dashboard';
import { TableSkeleton } from '@/components/table-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableBadges } from '@/components/table-badges';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery(DashboardStatsQueryOptions());
  const { data: boardedPets, isLoading: petsLoading } = useQuery(BoardedPetsQueryOptions());

  const statsCards: StatsCardData[] = [
    {
      title: "Today's Check-ins",
      value: stats?.todayCheckIns ?? 0,
      icon: CalendarCheck,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-700',
      descriptionColor: 'text-green-600',
    },
    {
      title: "Today's Check-outs",
      value: stats?.todayCheckOuts ?? 0,
      icon: CalendarX,
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-700',
    },
    {
      title: 'Currently Boarded',
      value: stats?.currentlyBoarded ?? 0,
      icon: Home,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-700',
    },
    {
      title: 'Bookings This Month',
      value: stats?.totalBookingsThisMonth ?? 0,
      icon: CalendarDays,
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <StatsCards
        cards={statsCards}
        isLoading={statsLoading}
        mobileGridCols={2}
        desktopGridCols={4}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Currently Boarded Pets</CardTitle>
        </CardHeader>
        <CardContent>
          {petsLoading ? (
            <TableSkeleton rows={4} columns={4} />
          ) : !boardedPets?.length ? (
            <p className="text-muted-foreground text-sm text-center py-8">No pets currently boarded.</p>
          ) : (
            <div className="space-y-2">
              {boardedPets.map((pet) => (
                <div
                  key={pet.bookingId}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-sm">{pet.petName}</p>
                    <p className="text-xs text-muted-foreground">{pet.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {pet.checkIn} → {pet.checkOut}
                    </p>
                    <TableBadges names={['CHECKED_IN']} visibleCount={1} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
