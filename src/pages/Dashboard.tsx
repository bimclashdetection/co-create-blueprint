import { Layout } from "@/components/Layout";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListTodo, UserCheck, CheckCircle2, AlertCircle, Plus, Clock } from "lucide-react";

const Dashboard = () => {
  const stats = [
    { 
      title: "Total Tasks", 
      value: "24", 
      icon: ListTodo, 
      iconColor: "text-primary",
      description: "Across all projects"
    },
    { 
      title: "Assigned to Me", 
      value: "8", 
      icon: UserCheck, 
      iconColor: "text-secondary",
      description: "3 high priority"
    },
    { 
      title: "Completed", 
      value: "12", 
      icon: CheckCircle2, 
      iconColor: "text-accent",
      description: "+2 from yesterday"
    },
    { 
      title: "Overdue", 
      value: "3", 
      icon: AlertCircle, 
      iconColor: "text-destructive",
      description: "Needs attention"
    },
  ];

  const recentTasks = [
    { id: "TT-001", title: "Update user authentication", assignee: "John Doe", status: "In Progress", priority: "High" },
    { id: "TT-002", title: "Fix mobile responsive issues", assignee: "Jane Smith", status: "In Progress", priority: "Medium" },
    { id: "TT-003", title: "Database optimization", assignee: "Mike Johnson", status: "Completed", priority: "High" },
    { id: "TT-004", title: "API documentation", assignee: "Sarah Wilson", status: "Not Started", priority: "Low" },
  ];

  const recentActivity = [
    { action: "Task TT-003 completed", user: "Mike Johnson", time: "2 minutes ago" },
    { action: "New task created", user: "John Doe", time: "15 minutes ago" },
    { action: "Comment added to TT-001", user: "Jane Smith", time: "1 hour ago" },
    { action: "Task TT-002 updated", user: "Sarah Wilson", time: "2 hours ago" },
  ];

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
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create New Task
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              iconColor={stat.iconColor}
              description={stat.description}
            />
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-2 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <h4 className="font-medium truncate">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.assignee}</p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
