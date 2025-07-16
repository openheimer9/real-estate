import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User, Lock, Bell, Shield, Upload, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Mock user data - in a real app, fetch this from your auth context or API
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 9876543210",
    bio: "Property owner with multiple properties in Mumbai and Bangalore.",
    role: "owner", // owner, renter, broker, admin
    avatar: "https://ui.shadcn.com/avatars/01.png",
    notifications: {
      email: {
        marketing: true,
        newMessages: true,
        propertyUpdates: true,
        accountAlerts: true,
      },
      push: {
        newMessages: true,
        propertyUpdates: true,
        accountAlerts: true,
      },
    },
    privacy: {
      showPhone: false,
      showEmail: false,
      profileVisibility: "registered", // public, registered, private
    },
  });

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleProfileSubmit = (data: z.infer<typeof profileSchema>) => {
    // In a real app, call API to update profile
    setUser({
      ...user,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      bio: data.bio || "",
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated",
    });
  };

  const handlePasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    // In a real app, call API to update password
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully",
    });
    
    passwordForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationChange = (category: string, type: "email" | "push", value: boolean) => {
    // In a real app, call API to update notification preferences
    setUser({
      ...user,
      notifications: {
        ...user.notifications,
        [type]: {
          ...user.notifications[type],
          [category]: value,
        },
      },
    });
  };

  const handlePrivacyChange = (setting: string, value: boolean | string) => {
    // In a real app, call API to update privacy settings
    setUser({
      ...user,
      privacy: {
        ...user.privacy,
        [setting]: value,
      },
    });
    
    toast({
      title: "Privacy settings updated",
      description: "Your privacy preferences have been saved",
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, upload the file to your server and get a URL back
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUser({
            ...user,
            avatar: event.target.result as string,
          });
          
          toast({
            title: "Avatar updated",
            description: "Your profile picture has been updated",
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center">
            <Lock className="h-4 w-4 mr-2" /> Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" /> Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Profile Picture</h3>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <label htmlFor="avatar-upload">
                        <Button variant="outline" className="cursor-pointer" type="button" asChild>
                          <div className="flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Upload</span>
                            <input 
                              id="avatar-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleAvatarUpload}
                            />
                          </div>
                        </Button>
                      </label>
                      <Button variant="ghost" type="button">
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended: Square JPG, PNG, or GIF, at least 300x300 pixels.
                    </p>
                  </div>
                </div>
                
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormDescription>
                            This will be used for account verification and communication.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a bit about yourself" 
                              className="min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            This will be displayed on your public profile. Max 500 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="flex items-center">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters long.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Password</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Marketing</h4>
                        <p className="text-sm text-muted-foreground">Receive emails about new features and promotions</p>
                      </div>
                      <Switch 
                        checked={user.notifications.email.marketing} 
                        onCheckedChange={(value) => handleNotificationChange("marketing", "email", value)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">New Messages</h4>
                        <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                      </div>
                      <Switch 
                        checked={user.notifications.email.newMessages} 
                        onCheckedChange={(value) => handleNotificationChange("newMessages", "email", value)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Property Updates</h4>
                        <p className="text-sm text-muted-foreground">Get notified about your property listings</p>
                      </div>
                      <Switch 
                        checked={user.notifications.email.propertyUpdates} 
                        onCheckedChange={(value) => handleNotificationChange("propertyUpdates", "email", value)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Account Alerts</h4>
                        <p className="text-sm text-muted-foreground">Receive important account notifications</p>
                      </div>
                      <Switch 
                        checked={user.notifications.email.accountAlerts} 
                        onCheckedChange={(value) => handleNotificationChange("accountAlerts", "email", value)} 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">New Messages</h4>
                        <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                      </div>
                      <Switch 
                        checked={user.notifications.push.newMessages} 
                        onCheckedChange={(value) => handleNotificationChange("newMessages", "push", value)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Property Updates</h4>
                        <p className="text-sm text-muted-foreground">Get notified about your property listings</p>
                      </div>
                      <Switch 
                        checked={user.notifications.push.propertyUpdates} 
                        onCheckedChange={(value) => handleNotificationChange("propertyUpdates", "push", value)} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Account Alerts</h4>
                        <p className="text-sm text-muted-foreground">Receive important account notifications</p>
                      </div>
                      <Switch 
                        checked={user.notifications.push.accountAlerts} 
                        onCheckedChange={(value) => handleNotificationChange("accountAlerts", "push", value)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" className="flex items-center">
                <Save className="h-4 w-4 mr-2" /> Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control your privacy and data sharing preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Show Phone Number</h4>
                      <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                    </div>
                    <Switch 
                      checked={user.privacy.showPhone} 
                      onCheckedChange={(value) => handlePrivacyChange("showPhone", value)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Show Email Address</h4>
                      <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                    </div>
                    <Switch 
                      checked={user.privacy.showEmail} 
                      onCheckedChange={(value) => handlePrivacyChange("showEmail", value)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">Profile Visibility</h4>
                      <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                    </div>
                    <select
                      className="form-select rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={user.privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange("profileVisibility", e.target.value)}
                    >
                      <option value="public">Public</option>
                      <option value="registered">Registered Users Only</option>
                      <option value="private">Private</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" className="flex items-center">
                <Save className="h-4 w-4 mr-2" /> Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;