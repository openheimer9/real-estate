import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Heart, MessageSquare, TrendingUp, Home, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DashboardHome = () => {
  const navigate = useNavigate();
  
  // Mock user data - in a real app, fetch this from your auth context or API
  const [user, setUser] = useState({
    name: "John Doe",
    role: "owner", // owner, renter, broker, admin
    stats: {
      listings: 2,
      views: 145,
      favorites: 12,
      messages: 5,
      listingLimit: 3,
    },
    recentActivity: [
      { type: "view", property: "Modern 2BHK Apartment", time: "2 hours ago" },
      { type: "message", property: "Spacious 3BHK Villa", time: "1 day ago" },
      { type: "favorite", property: "Cozy 1BHK Studio", time: "2 days ago" },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        {(user.role === "owner" || user.role === "broker") && (
          <Button onClick={() => navigate("/list-property")} className="btn-primary">
            <Plus className="mr-2 h-4 w-4" /> List New Property
          </Button>
        )}
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {(user.role === "owner" || user.role === "broker") && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.stats.listings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {user.stats.listingLimit - user.stats.listings} more available in your plan
              </p>
              <Progress 
                value={(user.stats.listings / user.stats.listingLimit) * 100} 
                className="h-1 mt-2" 
              />
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.views}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        {user.role === "renter" ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.stats.favorites}</div>
              <p className="text-xs text-muted-foreground mt-1">
                View your saved properties
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.stats.favorites}</div>
              <p className="text-xs text-muted-foreground mt-1">
                People who saved your listings
              </p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.messages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.stats.messages > 0 ? `${user.stats.messages} unread messages` : "No new messages"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your recent interactions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {user.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center">
                <div className="mr-4">
                  {activity.type === "view" && <Eye className="h-5 w-5 text-blue-500" />}
                  {activity.type === "message" && <MessageSquare className="h-5 w-5 text-green-500" />}
                  {activity.type === "favorite" && <Heart className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activity.type === "view" && "Someone viewed"}
                    {activity.type === "message" && "New message about"}
                    {activity.type === "favorite" && "Someone favorited"}
                    {" "}
                    <span className="font-semibold">{activity.property}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
            
            {user.recentActivity.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recommended Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {user.role === "renter" && (
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" onClick={() => navigate("/explore")}>
                <Building2 className="h-6 w-6 mb-2" />
                <span className="font-medium">Explore Properties</span>
                <span className="text-xs text-muted-foreground text-center">Discover new properties matching your preferences</span>
              </Button>
            )}
            
            {(user.role === "owner" || user.role === "broker") && (
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" onClick={() => navigate("/list-property")}>
                <Plus className="h-6 w-6 mb-2" />
                <span className="font-medium">Add New Listing</span>
                <span className="text-xs text-muted-foreground text-center">List a new property for rent</span>
              </Button>
            )}
            
            <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" onClick={() => navigate("/dashboard/messages")}>
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="font-medium">Check Messages</span>
              <span className="text-xs text-muted-foreground text-center">Respond to inquiries about properties</span>
            </Button>
            
            {(user.role === "owner" || user.role === "broker") && user.stats.listings > 0 && (
              <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" onClick={() => navigate("/dashboard/listings")}>
                <TrendingUp className="h-6 w-6 mb-2" />
                <span className="font-medium">View Analytics</span>
                <span className="text-xs text-muted-foreground text-center">Check performance of your listings</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;