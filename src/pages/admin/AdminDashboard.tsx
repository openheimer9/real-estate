import { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Users, Home, ListFilter, CreditCard, BarChart, Settings, Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import AdminUsers from "./AdminUsers";
import AdminListings from "./AdminListings";
import AdminSubscriptions from "./AdminSubscriptions";
import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";

const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // No need for mock admin data anymore

  const isActive = (path: string) => {
    return location.pathname === `/admin${path}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout hideFooter>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Link to="/admin">
                  <Button
                    variant={isActive("") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button
                    variant={isActive("/users") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                </Link>
                <Link to="/admin/listings">
                  <Button
                    variant={isActive("/listings") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <ListFilter className="mr-2 h-4 w-4" />
                    Listings
                  </Button>
                </Link>
                <Link to="/admin/subscriptions">
                  <Button
                    variant={isActive("/subscriptions") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscriptions
                  </Button>
                </Link>
                <Link to="/admin/analytics">
                  <Button
                    variant={isActive("/analytics") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Analytics
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button
                    variant={isActive("/settings") ? "default" : "ghost"}
                    className="w-full justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </nav>
            </CardContent>
          </Card>
          
          {/* Main Content */}
          <div>
            <Routes>
              <Route path="/" element={<AdminHome />} />
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/listings" element={<AdminListings />} />
              <Route path="/subscriptions" element={<AdminSubscriptions />} />
              <Route path="/analytics" element={<AdminAnalytics />} />
              <Route path="/settings" element={<AdminSettings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Admin Home Dashboard Component
const AdminHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-muted-foreground text-sm">Total Users</span>
              <span className="text-3xl font-bold">1,245</span>
              <span className="text-xs text-green-500">+12% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-muted-foreground text-sm">Active Listings</span>
              <span className="text-3xl font-bold">867</span>
              <span className="text-xs text-green-500">+5% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-muted-foreground text-sm">Revenue (Monthly)</span>
              <span className="text-3xl font-bold">₹2.4L</span>
              <span className="text-xs text-green-500">+18% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col space-y-2">
              <span className="text-muted-foreground text-sm">Active Subscriptions</span>
              <span className="text-3xl font-bold">432</span>
              <span className="text-xs text-green-500">+8% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New user registered", user: "Rahul Sharma", time: "5 minutes ago" },
              { action: "New listing created", user: "Priya Patel", time: "15 minutes ago" },
              { action: "Subscription purchased", user: "Amit Singh", time: "1 hour ago" },
              { action: "Listing reported", user: "Neha Gupta", time: "2 hours ago" },
              { action: "User account deleted", user: "Vikram Mehta", time: "3 hours ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;