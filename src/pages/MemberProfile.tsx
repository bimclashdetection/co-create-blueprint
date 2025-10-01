import { Layout } from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mail, Phone, Calendar, CheckCircle2, Clock } from "lucide-react";
import { TaskCard } from "@/components/tasks/TaskCard";
import { format } from "date-fns";

const mockMember = {
  id: "1",
  name: "John Smith",
  email: "john.smith@company.com",
  phone: "+1 234 567 8900",
  role: "Manager",
  department: "Engineering",
  joinedDate: new Date(2023, 0, 15),
  tasksAssigned: 12,
  tasksCompleted: 8,
  tasksInProgress: 3,
  tasksOverdue: 1,
  avgCompletionTime: "2.5 days",
  status: "online",
};

const mockTasks = [
  {
    id: "TSK-001",
    title: "Design Homepage",
    description: "Create new homepage design mockups",
    status: "in_progress" as const,
    priority: "high" as const,
    assignee: { name: "John Smith", initials: "JS" },
    dueDate: "2024-03-25",
    tags: ["Design", "UI/UX"],
  },
  {
    id: "TSK-002",
    title: "API Integration",
    description: "Integrate payment gateway API",
    status: "in_progress" as const,
    priority: "critical" as const,
    assignee: { name: "John Smith", initials: "JS" },
    dueDate: "2024-03-22",
    tags: ["Backend", "Integration"],
  },
];

const mockActivity = [
  {
    id: "1",
    action: "Completed task",
    taskName: "TSK-005: Database Migration",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "2",
    action: "Updated task status",
    taskName: "TSK-002: API Integration",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "3",
    action: "Commented on",
    taskName: "TSK-001: Design Homepage",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const MemberProfile = () => {
  const { userId } = useParams();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/team">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">
                      {mockMember.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <h2 className="text-2xl font-bold">{mockMember.name}</h2>
                      {mockMember.status === "online" && (
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      )}
                    </div>
                    <Badge variant={mockMember.role === "Manager" ? "default" : "secondary"}>
                      {mockMember.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{mockMember.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{mockMember.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {format(mockMember.joinedDate, "MMM d, yyyy")}</span>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Department</div>
                  <Badge variant="outline">{mockMember.department}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Assigned</span>
                  <span className="font-semibold">{mockMember.tasksAssigned}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-semibold text-green-600">{mockMember.tasksCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Progress</span>
                  <span className="font-semibold text-blue-600">{mockMember.tasksInProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Overdue</span>
                  <span className="font-semibold text-red-600">{mockMember.tasksOverdue}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Completion Time</span>
                  <span className="font-semibold">{mockMember.avgCompletionTime}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTasks.map((task) => (
                  <TaskCard key={task.id} {...task} />
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        {activity.id !== mockActivity[mockActivity.length - 1].id && (
                          <div className="w-px h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{" "}
                          <span className="text-muted-foreground">{activity.taskName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(activity.timestamp, "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberProfile;
