import { Layout } from "@/components/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityIndicator } from "@/components/tasks/PriorityIndicator";
import { TaskComments } from "@/components/tasks/TaskComments";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { Calendar, Clock, User, Edit, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const TaskDetail = () => {
  const { taskId } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Mock task data
  const task = {
    id: taskId || "TT-001",
    title: "Update user authentication flow",
    description:
      "Implement the new authentication flow with email verification and password reset functionality. This includes updating the backend API endpoints and frontend components to handle the new flow.",
    assignee: { name: "John Doe", initials: "JD", email: "john.doe@company.com" },
    assigner: { name: "Sarah Wilson", initials: "SW" },
    status: "in-progress" as const,
    priority: "high" as const,
    dueDate: "2025-10-05",
    createdDate: "2025-09-25",
    tags: ["Authentication", "Security", "Backend", "Frontend"],
  };

  const comments = [
    {
      id: "1",
      author: { name: "Sarah Wilson", initials: "SW" },
      content: "Please make sure to include the email verification step in the flow.",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      author: { name: "John Doe", initials: "JD" },
      content: "Started working on the backend API. Should have it done by end of day.",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      author: { name: "Mike Johnson", initials: "MJ" },
      content: "Let me know if you need help with the frontend integration.",
      timestamp: "30 minutes ago",
    },
  ];

  const activityHistory = [
    { action: "Status changed to In Progress", user: "John Doe", timestamp: "2 hours ago" },
    { action: "Priority changed to High", user: "Sarah Wilson", timestamp: "1 day ago" },
    { action: "Task assigned to John Doe", user: "Sarah Wilson", timestamp: "2 days ago" },
    { action: "Task created", user: "Sarah Wilson", timestamp: "3 days ago" },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Tasks", href: "/tasks" },
            { label: task.id },
          ]}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{task.id}</span>
              <span>•</span>
              <span>Created {task.createdDate}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
              </CardContent>
            </Card>

            <TaskComments comments={comments} />

            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityHistory.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <TaskStatusBadge status={task.status} />
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                    <PriorityIndicator priority={task.priority} />
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Assignee
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{task.assignee.name}</p>
                      <p className="text-xs text-muted-foreground">{task.assignee.email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned By</label>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{task.assigner.initials}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{task.assigner.name}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </label>
                  <p className="mt-1 text-sm font-medium">{task.dueDate}</p>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tags</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  Mark as Complete
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Change Status
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Reassign Task
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateTaskModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </Layout>
  );
};

export default TaskDetail;
