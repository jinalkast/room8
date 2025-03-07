import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book } from 'lucide-react';
import TaskList from './task-list';
import useGetCleanlinessTasks from '../hooks/useGetCleanlinessTasks';
import LoadingSpinner from '@/components/loading';
import useUser from '@/app/auth/hooks/useUser';

export default function CleanlinessLogs() {
  const { data: tasks, isLoading: loadingTasks } = useGetCleanlinessTasks();
  const { data: user } = useUser();

  if (loadingTasks || !tasks || !user) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cleanliness Tasks</CardTitle>
        <CardDescription>View the cleanliness Tasks for your house</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="yours">
          <TabsList>
            <TabsTrigger value="yours">
              <p>Yours</p>
            </TabsTrigger>
            <TabsTrigger value="unassigned">
              <p>Unassigned</p>
            </TabsTrigger>
            <TabsTrigger value="pending">
              <p>Pending</p>
            </TabsTrigger>
            <TabsTrigger value="history">
              <p>History</p>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yours">
            <TaskList
              tasks={tasks.filter(
                (task) => task.assigned_to_id === user.id && task.status === 'pending'
              )}
            />
          </TabsContent>
          <TabsContent value="unassigned">
            <TaskList tasks={tasks.filter((task) => task.status === 'unassigned')} />
          </TabsContent>
          <TabsContent value="pending">
            <TaskList tasks={tasks.filter((task) => task.status === 'pending')} />
          </TabsContent>
          <TabsContent value="history">
            <TaskList
              tasks={tasks.filter(
                (task) => task.status !== 'pending' && task.status !== 'unassigned'
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
