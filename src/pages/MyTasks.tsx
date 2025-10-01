import { Layout } from "@/components/Layout";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyTasks, useUpdateTask } from "@/hooks/useTasks";
import { useExport } from "@/hooks/useExport";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const MyTasks = () => {
  const { user } = useAuth();
  const { data: tasks, isLoading } = useMyTasks(user?.id || '');
  const { exportTasksToCSV } = useExport();
  const updateTask = useUpdateTask();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const myTasks = tasks || [];

  const inProgressTasks = myTasks.filter((t) => t.status === "in_progress");
  const notStartedTasks = myTasks.filter((t) => t.status === "not_started");
  const completedTasks = myTasks.filter((t) => t.status === "completed");
  const overdueTasks = myTasks.filter((t) => {
    if (t.status === "completed" || !t.due_date) return false;
    return new Date(t.due_date) < new Date();
  });

  const completionRate = myTasks.length > 0 
    ? Math.round((completedTasks.length / myTasks.length) * 100)
    : 0;

  const handleMarkAllComplete = async () => {
    const incompleteTasks = myTasks.filter(t => t.status !== 'completed');
    
    try {
      await Promise.all(
        incompleteTasks.map(task =>
          updateTask.mutateAsync({
            id: task.id,
            updates: { 
              status: 'completed',
              completed_at: new Date().toISOString()
            }
          })
        )
      );
      toast({
        title: "Success",
        description: `Marked ${incompleteTasks.length} tasks as complete.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tasks.",
        variant: "destructive",
      });
    }
  };

  const handleExportTasks = () => {
    exportTasksToCSV(myTasks);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Track and manage your assigned tasks</p>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressTasks.length}</div>
              <p className="text-xs text-muted-foreground">Active tasks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks.length}</div>
              <p className="text-xs text-muted-foreground">{completionRate}% completion rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overdueTasks.length}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Task Progress Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={completionRate} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{completedTasks.length} of {myTasks.length} completed</span>
              <span>{completionRate}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Task Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All ({myTasks.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned ({notStartedTasks.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {myTasks.length > 0 ? (
              myTasks.map((task) => (
                <TaskCard 
                  key={task.id}
                  id={task.task_id}
                  title={task.title}
                  assignee={{
                    name: task.assignee?.full_name || 'Unassigned',
                    initials: task.assignee?.full_name?.substring(0, 2).toUpperCase() || 'NA'
                  }}
                  status={task.status}
                  priority={task.priority}
                  dueDate={task.due_date ? format(new Date(task.due_date), 'MMM dd') : ''}
                  commentCount={0}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks assigned to you</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => (
                <TaskCard 
                  key={task.id}
                  id={task.task_id}
                  title={task.title}
                  assignee={{
                    name: task.assignee?.full_name || 'Unassigned',
                    initials: task.assignee?.full_name?.substring(0, 2).toUpperCase() || 'NA'
                  }}
                  status={task.status}
                  priority={task.priority}
                  dueDate={task.due_date ? format(new Date(task.due_date), 'MMM dd') : ''}
                  commentCount={0}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks in progress</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            {notStartedTasks.length > 0 ? (
              notStartedTasks.map((task) => (
                <TaskCard 
                  key={task.id}
                  id={task.task_id}
                  title={task.title}
                  assignee={{
                    name: task.assignee?.full_name || 'Unassigned',
                    initials: task.assignee?.full_name?.substring(0, 2).toUpperCase() || 'NA'
                  }}
                  status={task.status}
                  priority={task.priority}
                  dueDate={task.due_date ? format(new Date(task.due_date), 'MMM dd') : ''}
                  commentCount={0}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks waiting to start</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskCard 
                  key={task.id}
                  id={task.task_id}
                  title={task.title}
                  assignee={{
                    name: task.assignee?.full_name || 'Unassigned',
                    initials: task.assignee?.full_name?.substring(0, 2).toUpperCase() || 'NA'
                  }}
                  status={task.status}
                  priority={task.priority}
                  dueDate={task.due_date ? format(new Date(task.due_date), 'MMM dd') : ''}
                  commentCount={0}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed tasks</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions - Available to Team Members */}
        <div className="flex gap-3 flex-wrap">
          <Button 
            onClick={handleMarkAllComplete}
            disabled={myTasks.length === 0 || completedTasks.length === myTasks.length}
          >
            Mark All as Complete
          </Button>
          <Button variant="outline" onClick={handleExportTasks}>
            <Download className="mr-2 h-4 w-4" />
            Export My Tasks
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default MyTasks;
