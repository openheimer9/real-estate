import { useState } from "react";
import { Search, CreditCard, MoreHorizontal, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const AdminSubscriptions = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  
  // Mock subscriptions data - in a real app, fetch this from your API
  const [subscriptions, setSubscriptions] = useState([
    { id: 1, user: "John Doe", email: "john@example.com", plan: "Basic", status: "active", price: "₹499", billingCycle: "monthly", startDate: "Jan 15, 2023", endDate: "Feb 15, 2023", autoRenew: true },
    { id: 2, user: "Raj Patel", email: "raj@example.com", plan: "Premium", status: "active", price: "₹1,999", billingCycle: "monthly", startDate: "Feb 10, 2023", endDate: "Mar 10, 2023", autoRenew: true },
    { id: 3, user: "Priya Singh", email: "priya@example.com", plan: "Standard", status: "inactive", price: "₹999", billingCycle: "monthly", startDate: "Mar 5, 2023", endDate: "Apr 5, 2023", autoRenew: false },
    { id: 4, user: "Amit Kumar", email: "amit@example.com", plan: "Basic", status: "cancelled", price: "₹499", billingCycle: "monthly", startDate: "Apr 20, 2023", endDate: "May 20, 2023", autoRenew: false },
    { id: 5, user: "Neha Gupta", email: "neha@example.com", plan: "Premium", status: "active", price: "₹19,999", billingCycle: "yearly", startDate: "May 15, 2023", endDate: "May 15, 2024", autoRenew: true },
  ]);

  const handleToggleAutoRenew = (subscriptionId: number) => {
    // In a real app, call API to toggle auto-renew
    setSubscriptions(subscriptions.map(subscription => 
      subscription.id === subscriptionId ? { ...subscription, autoRenew: !subscription.autoRenew } : subscription
    ));
    
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    const newAutoRenew = !subscription?.autoRenew;
    
    toast({
      title: `Auto-renew ${newAutoRenew ? "enabled" : "disabled"}`,
      description: `Auto-renew has been ${newAutoRenew ? "enabled" : "disabled"} for ${subscription?.user}'s subscription`,
    });
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         subscription.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = planFilter === "all" || subscription.plan.toLowerCase() === planFilter.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Subscriptions</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user or email"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Plan</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Price</th>
                  <th className="text-left py-3 px-4 font-medium">Billing</th>
                  <th className="text-left py-3 px-4 font-medium">Start Date</th>
                  <th className="text-left py-3 px-4 font-medium">End Date</th>
                  <th className="text-center py-3 px-4 font-medium">Auto-Renew</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">{subscription.user}</td>
                    <td className="py-3 px-4">{subscription.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">{subscription.plan}</Badge>
                    </td>
                    <td className="py-3 px-4">
                    <Badge 
                        variant={
                            subscription.status === "active" ? "default" : 
                            subscription.status === "cancelled" ? "destructive" : 
                            "secondary"
                        }
                        className="capitalize"
                        >
                        {subscription.status}
                        </Badge>

                    </td>
                    <td className="py-3 px-4">{subscription.price}</td>
                    <td className="py-3 px-4 capitalize">{subscription.billingCycle}</td>
                    <td className="py-3 px-4">{subscription.startDate}</td>
                    <td className="py-3 px-4">{subscription.endDate}</td>
                    <td className="py-3 px-4 text-center">
                      {subscription.autoRenew ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleToggleAutoRenew(subscription.id)}
                      >
                        {subscription.autoRenew ? (
                          <X className="h-4 w-4 text-red-500" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500" />
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

export default AdminSubscriptions;