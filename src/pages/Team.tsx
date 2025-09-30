import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const mockTeamMembers = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 234 567 8900",
    role: "Manager",
    department: "Engineering",
    tasksAssigned: 12,
    tasksCompleted: 8,
    status: "online",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 234 567 8901",
    role: "Team Member",
    department: "Design",
    tasksAssigned: 8,
    tasksCompleted: 6,
    status: "online",
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.d@company.com",
    phone: "+1 234 567 8902",
    role: "Team Member",
    department: "Marketing",
    tasksAssigned: 15,
    tasksCompleted: 10,
    status: "offline",
  },
  {
    id: "4",
    name: "Emily Chen",
    email: "emily.c@company.com",
    phone: "+1 234 567 8903",
    role: "Manager",
    department: "Product",
    tasksAssigned: 10,
    tasksCompleted: 7,
    status: "online",
  },
];

const Team = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = mockTeamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Team Members</h1>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Member
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Link key={member.id} to={`/team/${member.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{member.name}</h3>
                        {member.status === "online" && (
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                        )}
                      </div>
                      <Badge variant={member.role === "Manager" ? "default" : "secondary"}>
                        {member.role}
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-sm text-muted-foreground mb-2">
                      Department: {member.department}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tasks:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{member.tasksAssigned} assigned</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {member.tasksCompleted} done
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No team members found matching your search.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Team;
