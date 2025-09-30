import { Layout } from "@/components/Layout";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

const MyTasks = () => {
  const myTasks = [
    {
      id: "TT-001",
      title: "Update user authentication flow",
      assignee: { name: "John Doe", initials: "JD" },
      status: "in-progress" as const,
      priority: "high" as const,
      dueDate: "Oct 5",
      commentCount: 3,
    },
    {
      id: "TT-005",
      title: "Implement real-time notifications",
      assignee: { name: "John Doe", initials: "JD" },
      status: "in-progress" as const,
      priority: "critical" as const,
      dueDate: "Oct 3",
      commentCount: 5,
    },
    {
      id: "TT-008",
      title: "Code review for PR #234",
      assignee: { name: "John Doe", initials: "JD" },
      status: "assigned" as const,
      priority: "medium" as const,
      dueDate: "Oct 10",
      commentCount: 1,
    },
    {
      id: "TT-011",
      title: "Update documentation",
      assignee: { name: "John Doe", initials: "JD" },
      status: "completed" as const,
      priority: "low" as const,
      dueDate: "Sep 30",
      commentCount: 2,
    },
  ];

  const inProgressTasks = myTasks.filter((t) => t.status === "in-progress");
  const notStartedTasks = myTasks.filter((t) => t.status === "assigned");
  const completedTasks = myTasks.filter((t) => t.status === "completed");
  const overdueTasks = myTasks.filter((t) => t.status !== "completed" && new Date(t.dueDate) < new Date());

  const completionRate = Math.round((completedTasks.length / myTasks.length) * 100);

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
            {myTasks.map((task) => (
              <TaskCard key={task.id} {...task} />
            ))}
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((task) => <TaskCard key={task.id} {...task} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks in progress</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            {notStartedTasks.length > 0 ? (
              notStartedTasks.map((task) => <TaskCard key={task.id} {...task} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks waiting to start</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => <TaskCard key={task.id} {...task} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No completed tasks</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button>Mark All as Complete</Button>
          <Button variant="outline">Export My Tasks</Button>
        </div>
      </div>
    </Layout>
  );
};

export default MyTasks;
