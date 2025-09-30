import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low";

interface PriorityIndicatorProps {
  priority: Priority;
  showIcon?: boolean;
  className?: string;
}

export const PriorityIndicator = ({ priority, showIcon = true, className }: PriorityIndicatorProps) => {
  const priorityConfig = {
    critical: {
      label: "Critical",
      icon: AlertCircle,
      className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    },
    high: {
      label: "High",
      icon: ArrowUp,
      className: "bg-destructive/10 text-destructive hover:bg-destructive/20",
    },
    medium: {
      label: "Medium",
      icon: Minus,
      className: "bg-secondary/10 text-secondary hover:bg-secondary/20",
    },
    low: {
      label: "Low",
      icon: ArrowDown,
      className: "bg-muted text-muted-foreground hover:bg-muted/80",
    },
  };

  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
};
