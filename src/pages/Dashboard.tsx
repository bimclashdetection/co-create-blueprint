import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListTodo, UserCheck, CheckCircle2, AlertCircle, Plus, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTaskStats } from "@/hooks/useAnalytics";
import { useTasks } from "@/hooks/useTasks";
import { useActivityLogs } from "@/hooks/useActivityLogs";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { AnalyticsChart } from "@/components/analytics/AnalyticsChart";
import { useDailyTaskMetrics } from "@/hooks/useAnalytics";
import { useState } from "react";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: taskStats } = useTaskStats(user?.id);
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: activityLogs } = useActivityLogs(10);
  const { data: dailyMetrics } = useDailyTaskMetrics(1);

  const recentTasks = tasks?.slice(0, 4) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-accent/10 text-accent hover:bg-accent/20";
      case "In Progress":
        return "bg-primary/10 text-primary hover:bg-primary/20";
      case "Not Started":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive";
      case "Medium":
        return "bg-secondary/10 text-secondary";
      case "Low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your tasks.</p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Tasks"
            value={taskStats?.total || 0}
            icon={ListTodo}
            iconColor="text-primary"
            description="Across all projects"
          />
          <StatsCard
            title="Assigned to Me"
            value={taskStats?.assignedToMe || 0}
            icon={UserCheck}
            iconColor="text-secondary"
            description={`${taskStats?.inProgress || 0} in progress`}
          />
          <StatsCard
            title="Completed"
            value={taskStats?.completed || 0}
            icon={CheckCircle2}
            iconColor="text-accent"
            description="All time"
          />
          <StatsCard
            title="Overdue"
            value={taskStats?.overdue || 0}
            icon={AlertCircle}
            iconColor="text-destructive"
            description="Needs attention"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasksLoading ? (
                  <p className="text-muted-foreground text-center py-4">Loading tasks...</p>
                ) : recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-muted-foreground">{task.task_id}</span>
                            <Badge variant="outline" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          </div>
                          <h4 className="font-medium truncate">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.assignee?.full_name || 'Unassigned'}</p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No tasks yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs && activityLogs.length > 0 ? (
                  activityLogs.map((log: any) => (
                    <div key={log.id} className="flex gap-3">
                      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{log.action_type.replace('_', ' ')}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{log.user?.full_name || 'Unknown'}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {dailyMetrics && dailyMetrics.length > 0 && (
          <AnalyticsChart
            title="Task Activity (Last 30 Days)"
            data={dailyMetrics}
            type="line"
            dataKeys={[
              { key: 'created', color: 'hsl(var(--primary))', name: 'Created' },
              { key: 'completed', color: 'hsl(var(--accent))', name: 'Completed' },
            ]}
          />
        )}
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </Layout>
  );
};

export default Dashboard;
