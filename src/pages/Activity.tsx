import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Download, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const mockActivities = [
  {
    id: "1",
    user: "John Smith",
    action: "created",
    target: "Task",
    targetName: "TSK-001: Design Homepage",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    details: "Created new task and assigned to Sarah Johnson",
  },
  {
    id: "2",
    user: "Sarah Johnson",
    action: "updated",
    target: "Task",
    targetName: "TSK-002: API Integration",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    details: "Changed status from Assigned to In Progress",
  },
  {
    id: "3",
    user: "Mike Davis",
    action: "completed",
    target: "Task",
    targetName: "TSK-003: Content Review",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    details: "Marked task as completed",
  },
  {
    id: "4",
    user: "Emily Chen",
    action: "commented",
    target: "Task",
    targetName: "TSK-001: Design Homepage",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    details: "Added comment: 'Please review the latest mockups'",
  },
  {
    id: "5",
    user: "John Smith",
    action: "assigned",
    target: "Task",
    targetName: "TSK-004: Bug Fix - Login Issue",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    details: "Assigned task to Mike Davis",
  },
  {
    id: "6",
    user: "Sarah Johnson",
    action: "updated",
    target: "Task",
    targetName: "TSK-005: Database Optimization",
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    details: "Changed priority from Medium to High",
  },
];

const actionColors = {
  created: "bg-blue-500",
  updated: "bg-yellow-500",
  completed: "bg-green-500",
  commented: "bg-purple-500",
  assigned: "bg-orange-500",
  deleted: "bg-red-500",
};

const Activity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === "all" || activity.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="commented">Commented</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{activity.user}</span>
                          <Badge
                            variant="outline"
                            className={`${
                              actionColors[activity.action as keyof typeof actionColors]
                            } text-white border-0`}
                          >
                            {activity.action}
                          </Badge>
                          <span className="text-muted-foreground">{activity.target}</span>
                        </div>
                        <div className="font-medium text-sm">{activity.targetName}</div>
                        <div className="text-sm text-muted-foreground">{activity.details}</div>
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(activity.timestamp, "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No activities found matching your filters.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Activity;
