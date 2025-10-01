import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Mail, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfiles";
import { AddMemberModal } from "@/components/team/AddMemberModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTasks } from "@/hooks/useTasks";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrentUserRole } from "@/hooks/useProfiles";

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const { user } = useAuth();
  const { data: userRole } = useCurrentUserRole(user?.id);
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const { data: tasks } = useTasks();

  const isManager = userRole === 'manager';

  const getTaskStats = (userId: string) => {
    if (!tasks) return { assigned: 0, completed: 0 };
    const userTasks = tasks.filter(task => task.assignee_id === userId);
    return {
      assigned: userTasks.length,
      completed: userTasks.filter(task => task.status === 'completed').length,
    };
  };

  const filteredMembers = profiles?.filter(
    (member) =>
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Team Members</h1>
          {isManager && (
            <Button onClick={() => setIsAddMemberOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {profilesLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const stats = getTaskStats(member.id);
                return (
                  <Link key={member.id} to={`/team/${member.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">
                              {member.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate mb-1">{member.full_name}</h3>
                            <Badge variant={member.role === "manager" ? "default" : "secondary"}>
                              {member.role === "manager" ? "Manager" : "Team Member"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tasks:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{stats.assigned} assigned</span>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {stats.completed} done
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {filteredMembers.length === 0 && !profilesLoading && (
              <div className="text-center py-12 text-muted-foreground">
                No team members found matching your search.
              </div>
            )}
          </>
        )}
      </div>

      <AddMemberModal open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen} />
    </Layout>
  );
};

export default Team;
