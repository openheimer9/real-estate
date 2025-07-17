import { useState } from "react";
import { Ban, Check, MoreHorizontal, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  
  // Mock users data - in a real app, fetch this from your API
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "owner", status: "active", listings: 2, joined: "Jan 15, 2023" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "renter", status: "active", listings: 0, joined: "Feb 20, 2023" },
    { id: 3, name: "Raj Patel", email: "raj@example.com", role: "broker", status: "active", listings: 8, joined: "Mar 5, 2023" },
    { id: 4, name: "Priya Singh", email: "priya@example.com", role: "owner", status: "inactive", listings: 1, joined: "Apr 10, 2023" },
    { id: 5, name: "Alex Johnson", email: "alex@example.com", role: "renter", status: "banned", listings: 0, joined: "May 22, 2023" },
  ]);

  const handleBanUser = (userId: number) => {
    // In a real app, call API to ban user
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: user.status === "banned" ? "active" : "banned" } : user
    ));
    
    const user = users.find(u => u.id === userId);
    const newStatus = user?.status === "banned" ? "active" : "banned";
    
    toast({
      title: `User ${newStatus === "banned" ? "banned" : "unbanned"}`,
      description: `${user?.name} has been ${newStatus === "banned" ? "banned" : "unbanned"} successfully`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="renter">Renters</SelectItem>
                <SelectItem value="broker">Brokers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Listings</th>
                  <th className="text-left py-3 px-4 font-medium">Joined</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">{user.role}</Badge>
                    </td>
                    <td className="py-3 px-4">
                    <Badge 
                    variant={
                        user.status === "active" ? "default" : 
                        user.status === "banned" ? "destructive" : 
                        "secondary"
                    }
                    className="capitalize"
                    >
                     {user.status}
                    </Badge>

                    </td>
                    <td className="py-3 px-4">{user.listings}</td>
                    <td className="py-3 px-4">{user.joined}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleBanUser(user.id)}
                      >
                        {user.status === "banned" ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Ban className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;