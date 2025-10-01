import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TaskStatus = "not_started" | "in_progress" | "completed" | "on_hold";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const TaskStatusBadge = ({ status, className }: TaskStatusBadgeProps) => {
  const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
    not_started: {
      label: "Not Started",
      className: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
    in_progress: {
      label: "In Progress",
      className: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    completed: {
      label: "Completed",
      className: "bg-accent/10 text-accent hover:bg-accent/20",
    },
    on_hold: {
      label: "On Hold",
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    },
  };

  const config = statusConfig[status] || statusConfig.not_started;

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
