import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TaskStatus = "assigned" | "in-progress" | "pending-review" | "pending-approval" | "completed" | "on-hold";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export const TaskStatusBadge = ({ status, className }: TaskStatusBadgeProps) => {
  const statusConfig = {
    assigned: {
      label: "Assigned",
      className: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
    "in-progress": {
      label: "In Progress",
      className: "bg-primary/10 text-primary hover:bg-primary/20",
    },
    "pending-review": {
      label: "Pending Review",
      className: "bg-secondary/10 text-secondary hover:bg-secondary/20",
    },
    "pending-approval": {
      label: "Pending Final Approval",
      className: "bg-accent/20 text-accent hover:bg-accent/30",
    },
    completed: {
      label: "Completed",
      className: "bg-accent/10 text-accent hover:bg-accent/20",
    },
    "on-hold": {
      label: "On Hold",
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
