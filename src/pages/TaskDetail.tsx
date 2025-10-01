import { Layout } from "@/components/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityIndicator } from "@/components/tasks/PriorityIndicator";
import { TaskComments } from "@/components/tasks/TaskComments";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Calendar, Clock, User, Edit, Trash2, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask, useUpdateTask, useDeleteTask } from "@/hooks/useTasks";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUserRole } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const TaskDetail = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userRole } = useCurrentUserRole(user?.id);
  const { data: task, isLoading } = useTask(taskId || '');
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const isManager = userRole === 'manager';
  const isAssignee = task?.assignee_id === user?.id;

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    
    try {
      await updateTask.mutateAsync({
        id: task.id,
        updates: { 
          status: newStatus as any,
          ...(newStatus === 'completed' && { completed_at: new Date().toISOString() })
        }
      });
      toast({
        title: "Status updated",
        description: "Task status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const handleMarkComplete = async () => {
    if (!task) return;
    await handleStatusChange('completed');
  };

  const handleDelete = async () => {
    if (!task || !confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask.mutateAsync(task.id);
      toast({
        title: "Task deleted",
        description: "Task has been deleted successfully.",
      });
      navigate('/tasks');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: "Tasks", href: "/tasks" },
            { label: task.task_id },
          ]}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{task.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{task.task_id}</span>
              <span>•</span>
              <span>Created {format(new Date(task.created_at), 'MMM dd, yyyy')}</span>
            </div>
          </div>
          {isManager && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
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
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {task.description || 'No description provided'}
                </p>
              </CardContent>
            </Card>

            <TaskComments taskId={task.id} />
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
                      <AvatarFallback>
                        {task.assignee?.full_name?.substring(0, 2).toUpperCase() || 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{task.assignee?.full_name || 'Unassigned'}</p>
                      <p className="text-xs text-muted-foreground">{task.assignee?.email}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Assigned By</label>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {task.assigner?.full_name?.substring(0, 2).toUpperCase() || 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{task.assigner?.full_name || 'Unknown'}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date
                  </label>
                  <p className="mt-1 text-sm font-medium">
                    {task.due_date ? format(new Date(task.due_date), 'MMM dd, yyyy') : 'No due date'}
                  </p>
                </div>

                {task.tags && task.tags.length > 0 && (
                  <>
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
                  </>
                )}
              </CardContent>
            </Card>

            {(isManager || isAssignee) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {task.status !== 'completed' && (
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleMarkComplete}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark as Complete
                    </Button>
                  )}
                  {(isManager || isAssignee) && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Change Status
                      </label>
                      <Select value={task.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {isManager && (
        <CreateTaskModal 
          open={editModalOpen} 
          onOpenChange={setEditModalOpen}
          taskToEdit={task}
        />
      )}
    </Layout>
  );
};

export default TaskDetail;
