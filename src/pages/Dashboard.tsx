import { useState } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Home, ListFilter, Heart, MessageSquare, CreditCard, Settings, LogOut, User, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import DashboardHome from "./dashboard/DashboardHome";
import MyListings from "./dashboard/MyListings";
import Favorites from "./dashboard/Favorites";
import Messages from "./dashboard/Messages";
import Subscriptions from "./dashboard/Subscriptions";
import SettingsPage from "./dashboard/Settings";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mock user data - in a real app, fetch this from your auth context or API
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "owner", // owner, renter, broker, admin
    avatar: "https://ui.shadcn.com/avatars/01.png",
    subscription: {
      plan: "Basic",
      status: "active",
      expiresAt: "2024-12-31",
    },
  });

  const isActive = (path: string) => {
    return location.pathname === `/dashboard${path}`;
  };

  const handleLogout = () => {
    // Implement logout logic here
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <Layout hideFooter>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {user.role === "owner" && "Property Owner"}
                  {user.role === "renter" && "Home Seeker"}
                  {user.role === "broker" && "Real Estate Broker"}
                  {user.role === "admin" && "Administrator"}
                </p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link to="/dashboard" className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${isActive('') ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              
              {(user.role === "owner" || user.role === "broker") && (
                <Link to="/dashboard/listings" className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${isActive('/listings') ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  <ListFilter className="h-4 w-4" />
                  <span>My Listings</span>
                </Link>
              )}
              
              {user.role === "renter" && (
                <Link to="/dashboard/favorites" className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${isActive('/favorites') ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Link>
              )}
              
              <Link to="/dashboard/messages" className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${isActive('/messages') ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </Link>
              
              {(user.role === "owner" || user.role === "broker") && (
                <Link to="/dashboard/subscriptions" className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${isActive('/subscriptions') ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                  <CreditCard className="h-4 w-4" />
                  <span>Subscription</span>
                </Link>
              )}
              
              <Link to="/dashboard/settings" className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full ${isActive('/settings') ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}>
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
              
              <Button 
                variant="ghost" 
                className="flex items-center space-x-2 px-3 py-2 rounded-md w-full justify-start hover:bg-secondary text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
            
            {(user.role === "owner" || user.role === "broker") && user.subscription && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Subscription</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Plan:</span>{" "}
                      <span className="font-medium">{user.subscription.plan}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Status:</span>{" "}
                      <span className="font-medium capitalize">{user.subscription.status}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Expires:</span>{" "}
                      <span className="font-medium">{new Date(user.subscription.expiresAt).toLocaleDateString()}</span>
                    </p>
                  </div>
                  <Button size="sm" className="w-full mt-3" onClick={() => navigate("/pricing")}>
                    Manage Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Main Content */}
          <div>
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/listings" element={<MyListings />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;