import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Mock settings data - in a real app, fetch this from your API
  const [settings, setSettings] = useState({
    general: {
      siteName: "RentSpace",
      siteDescription: "A real estate rental web app for homeowners and renters",
      contactEmail: "support@rentspace.com",
      supportPhone: "+91 9876543210",
    },
    features: {
      enableAI: true,
      enableChat: true,
      enablePayments: true,
      enableReporting: true,
      enableAnalytics: true,
      maintenanceMode: false,
    },
    notifications: {
      newUserAlert: true,
      newListingAlert: true,
      paymentAlert: true,
      reportAlert: true,
    },
    security: {
      twoFactorAuth: false,
      passwordExpiry: 90, // days
      sessionTimeout: 30, // minutes
      maxLoginAttempts: 5,
    },
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, call API to update settings
    toast({
      title: "Settings updated",
      description: "General settings have been updated successfully",
    });
  };

  const handleFeatureToggle = (feature: string, value: boolean) => {
    // In a real app, call API to update feature settings
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [feature]: value,
      },
    });
    
    toast({
      title: `${value ? "Enabled" : "Disabled"} ${feature}`,
      description: `${feature} has been ${value ? "enabled" : "disabled"} successfully`,
    });
  };

  const handleNotificationToggle = (notification: string, value: boolean) => {
    // In a real app, call API to update notification settings
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [notification]: value,
      },
    });
    
    toast({
      title: `${value ? "Enabled" : "Disabled"} ${notification}`,
      description: `${notification} has been ${value ? "enabled" : "disabled"} successfully`,
    });
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, call API to update security settings
    toast({
      title: "Security settings updated",
      description: "Security settings have been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the basic settings for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName" 
                    value={settings.general.siteName}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteName: e.target.value }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea 
                    id="siteDescription" 
                    value={settings.general.siteDescription}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, siteDescription: e.target.value }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, contactEmail: e.target.value }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input 
                    id="supportPhone" 
                    value={settings.general.supportPhone}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, supportPhone: e.target.value }
                    })}
                  />
                </div>
                
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Settings</CardTitle>
              <CardDescription>
                Enable or disable features for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAI">AI Features</Label>
                    <p className="text-sm text-muted-foreground">Enable AI-powered recommendations and rent suggestions</p>
                  </div>
                  <Switch 
                    id="enableAI"
                    checked={settings.features.enableAI}
                    onCheckedChange={(value) => handleFeatureToggle("enableAI", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableChat">In-App Chat</Label>
                    <p className="text-sm text-muted-foreground">Enable messaging between users</p>
                  </div>
                  <Switch 
                    id="enableChat"
                    checked={settings.features.enableChat}
                    onCheckedChange={(value) => handleFeatureToggle("enableChat", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enablePayments">Payment System</Label>
                    <p className="text-sm text-muted-foreground">Enable subscription payments</p>
                  </div>
                  <Switch 
                    id="enablePayments"
                    checked={settings.features.enablePayments}
                    onCheckedChange={(value) => handleFeatureToggle("enablePayments", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableReporting">User Reporting</Label>
                    <p className="text-sm text-muted-foreground">Allow users to report listings and other users</p>
                  </div>
                  <Switch 
                    id="enableReporting"
                    checked={settings.features.enableReporting}
                    onCheckedChange={(value) => handleFeatureToggle("enableReporting", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenanceMode" className="text-red-500 font-medium">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Put the site in maintenance mode (only admins can access)</p>
                  </div>
                  <Switch 
                    id="maintenanceMode"
                    checked={settings.features.maintenanceMode}
                    onCheckedChange={(value) => handleFeatureToggle("maintenanceMode", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure admin notifications for important events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newUserAlert">New User Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a new user registers</p>
                  </div>
                  <Switch 
                    id="newUserAlert"
                    checked={settings.notifications.newUserAlert}
                    onCheckedChange={(value) => handleNotificationToggle("newUserAlert", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newListingAlert">New Listing Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a new property is listed</p>
                  </div>
                  <Switch 
                    id="newListingAlert"
                    checked={settings.notifications.newListingAlert}
                    onCheckedChange={(value) => handleNotificationToggle("newListingAlert", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="paymentAlert">Payment Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified for subscription payments and failures</p>
                  </div>
                  <Switch 
                    id="paymentAlert"
                    checked={settings.notifications.paymentAlert}
                    onCheckedChange={(value) => handleNotificationToggle("paymentAlert", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reportAlert">Report Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a user reports content</p>
                  </div>
                  <Switch 
                    id="reportAlert"
                    checked={settings.notifications.reportAlert}
                    onCheckedChange={(value) => handleNotificationToggle("reportAlert", value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch 
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(value) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: value }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input 
                    id="passwordExpiry" 
                    type="number"
                    value={settings.security.passwordExpiry}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, passwordExpiry: parseInt(e.target.value) }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input 
                    id="maxLoginAttempts" 
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                    })}
                  />
                </div>
                
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;