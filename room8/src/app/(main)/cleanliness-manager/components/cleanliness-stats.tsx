'use client';

import LoadingSpinner from '@/components/loading';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import UserGuideModal from '@/components/user-guide-modal';
import { USER_GUIDE } from '@/lib/constants/user-guide';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import useCleanlinessStats from '../hooks/useCleanlinessStats';
import { chartConfig } from '../utils/chart-config';

export default function CleanlinessStats() {
  const { data: cleanlinessStats } = useCleanlinessStats();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          Cleanliness Stats
          <UserGuideModal data={USER_GUIDE.CM_STATS} />
        </CardTitle>
        <CardDescription>Here&apos;s how everyone&apos;s doing with cleanliness!</CardDescription>
      </CardHeader>
      <CardContent>
        {cleanlinessStats ? (
          <div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={cleanlinessStats} margin={{ left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={30}
                  tickMargin={5}
                  domain={[
                    0,
                    Math.max(
                      ...cleanlinessStats.map((stat) =>
                        Math.max(stat.assignedByTasks, stat.assignedToTasks, stat.completedByTasks)
                      )
                    ) + 2
                  ]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="assignedByTasks" fill="var(--color-assignedByTasks)" radius={4} />
                <Bar dataKey="assignedToTasks" fill="var(--color-assignedToTasks)" radius={4} />
                <Bar dataKey="completedByTasks" fill="var(--color-completedByTasks)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </CardContent>
    </Card>
  );
}
