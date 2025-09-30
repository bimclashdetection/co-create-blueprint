import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityIndicator } from "@/components/tasks/PriorityIndicator";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Tasks = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const tasks = [
    {
      id: "TT-001",
      title: "Update user authentication flow",
      assignee: { name: "John Doe", initials: "JD" },
      status: "in-progress" as const,
      priority: "high" as const,
      dueDate: "2025-10-05",
    },
    {
      id: "TT-002",
      title: "Fix mobile responsive issues",
      assignee: { name: "Jane Smith", initials: "JS" },
      status: "in-progress" as const,
      priority: "medium" as const,
      dueDate: "2025-10-08",
    },
    {
      id: "TT-003",
      title: "Database optimization",
      assignee: { name: "Mike Johnson", initials: "MJ" },
      status: "completed" as const,
      priority: "high" as const,
      dueDate: "2025-09-28",
    },
    {
      id: "TT-004",
      title: "API documentation",
      assignee: { name: "Sarah Wilson", initials: "SW" },
      status: "assigned" as const,
      priority: "low" as const,
      dueDate: "2025-10-15",
    },
    {
      id: "TT-005",
      title: "Implement real-time notifications",
      assignee: { name: "John Doe", initials: "JD" },
      status: "in-progress" as const,
      priority: "critical" as const,
      dueDate: "2025-10-03",
    },
    {
      id: "TT-006",
      title: "Design new landing page",
      assignee: { name: "Jane Smith", initials: "JS" },
      status: "assigned" as const,
      priority: "medium" as const,
      dueDate: "2025-10-12",
    },
    {
      id: "TT-007",
      title: "Security audit",
      assignee: { name: "Mike Johnson", initials: "MJ" },
      status: "on-hold" as const,
      priority: "high" as const,
      dueDate: "2025-10-20",
    },
  ];

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const toggleAllTasks = () => {
    setSelectedTasks((prev) => (prev.length === tasks.length ? [] : tasks.map((t) => t.id)));
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">All Tasks</h1>
            <p className="text-muted-foreground">Manage and track all tasks across your team</p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending-review">Pending Review</SelectItem>
                <SelectItem value="pending-approval">Pending Final Approval</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">{selectedTasks.length} selected</span>
            <Button variant="outline" size="sm">
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        )}

        {/* Tasks Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTasks.length === tasks.length}
                    onCheckedChange={toggleAllTasks}
                  />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    Task ID
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    Title
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    Due Date
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Link to={`/tasks/${task.id}`} className="font-mono text-sm text-primary hover:underline">
                      {task.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link to={`/tasks/${task.id}`} className="font-medium hover:underline">
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TaskStatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityIndicator priority={task.priority} />
                  </TableCell>
                  <TableCell className="text-sm">{task.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks found matching your filters</p>
          </div>
        )}
      </div>

      <CreateTaskModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </Layout>
  );
};

export default Tasks;
