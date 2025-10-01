import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { PriorityIndicator } from "./PriorityIndicator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type TaskStatus = "not_started" | "in_progress" | "completed" | "on_hold";
type Priority = "critical" | "high" | "medium" | "low";

interface TaskCardProps {
  id: string;
  title: string;
  department?: string;
  website?: string;
  assignee: {
    name: string;
    initials: string;
  };
  status: TaskStatus;
  priority: Priority;
  dueDate: string;
  commentCount?: number;
  className?: string;
}

export const TaskCard = ({
  id,
  title,
  department,
  website,
  assignee,
  status,
  priority,
  dueDate,
  commentCount = 0,
  className,
}: TaskCardProps) => {
  return (
    <Link to={`/tasks/${id}`}>
      <Card className={cn("hover:bg-muted/50 transition-colors cursor-pointer", className)}>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{id}</span>
                  {department && (
                    <Badge variant="outline" className="text-xs">
                      {department}
                    </Badge>
                  )}
                  {website && (
                    <Badge variant="outline" className="text-xs bg-muted">
                      {website}
                    </Badge>
                  )}
                  <PriorityIndicator priority={priority} />
                </div>
                <h4 className="font-medium line-clamp-2">{title}</h4>
              </div>
              <TaskStatusBadge status={status} />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">{assignee.initials}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">{assignee.name}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {dueDate}
                </span>
                {commentCount > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {commentCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
