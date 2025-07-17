import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30days");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Custom Range
          </Button>
        </div>
      </div>
      
      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,65,890</div>
            <p className="text-xs text-green-500 mt-1">+18% from previous period</p>
            <div className="mt-4 h-[80px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Revenue chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">432</div>
            <p className="text-xs text-green-500 mt-1">+8% from previous period</p>
            <div className="mt-4 h-[80px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-xs text-muted-foreground">Subscriptions chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-green-500 mt-1">+12% from previous period</p>
            <div className="mt-4 h-[80px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-xs text-muted-foreground">User growth chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Popular Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Location chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Listing Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Listing activity chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Subscription distribution chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>User Roles Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] bg-secondary rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">User roles chart would be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;