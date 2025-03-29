import { type ChartConfig } from '@/components/ui/chart';

export const chartConfig = {
  assignedToTasks: {
    label: 'Assigned',
    color: '#FEF08A'
  },
  assignedByTasks: {
    label: 'Gave Out',
    color: '#60a5fa'
  },
  completedByTasks: {
    label: 'Completed',
    color: '#1FA64F'
  }
} satisfies ChartConfig;
