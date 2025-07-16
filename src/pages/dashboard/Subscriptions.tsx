import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  maxListings: number;
  userType: "owner" | "broker" | "both";
}

const Subscriptions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock user data - in a real app, fetch this from your auth context or API
  const [user, setUser] = useState({
    name: "John Doe",
    role: "owner", // owner, broker
    subscription: {
      plan: "Basic",
      status: "active",
      expiresAt: "2024-12-31",
      listings: {
        used: 1,
        total: 1,
      },
      paymentMethod: {
        type: "card",
        last4: "4242",
        expiryMonth: 12,
        expiryYear: 2025,
      },
      billingCycle: "monthly",
      autoRenew: true,
      price: 499,
    },
  });

  const plans: SubscriptionPlan[] = [
    {
      id: "basic-owner",
      name: "Basic",
      price: 499,
      description: "Perfect for individual homeowners with a single property",
      features: [
        { name: "1 Property Listing", included: true },
        { name: "Basic Analytics", included: true },
        { name: "Email Support", included: true },
        { name: "Featured Listing", included: false },
        { name: "AI Rent Suggestion", included: false },
        { name: "Priority Support", included: false },
      ],
      maxListings: 1,
      userType: "owner",
    },
    {
      id: "standard-owner",
      name: "Standard",
      price: 999,
      description: "Ideal for homeowners with multiple properties",
      features: [
        { name: "3 Property Listings", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Email & Chat Support", included: true },
        { name: "1 Featured Listing", included: true },
        { name: "AI Rent Suggestion", included: true },
        { name: "Priority Support", included: false },
      ],
      popular: true,
      maxListings: 3,
      userType: "owner",
    },
    {
      id: "premium-owner",
      name: "Premium",
      price: 1999,
      description: "For serious property owners with multiple properties",
      features: [
        { name: "10 Property Listings", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Priority Support", included: true },
        { name: "3 Featured Listings", included: true },
        { name: "AI Rent Suggestion", included: true },
        { name: "Verified Badge", included: true },
      ],
      maxListings: 10,
      userType: "owner",
    },
  ];

  const currentPlan = plans.find(plan => plan.name === user.subscription.plan);
  const daysLeft = Math.ceil((new Date(user.subscription.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const usagePercentage = (user.subscription.listings.used / user.subscription.listings.total) * 100;

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  const handleCancelSubscription = () => {
    // In a real app, call API to cancel subscription
    toast({
      title: "Subscription cancelled",
      description: "Your subscription will remain active until the end of the billing period",
    });
    
    setUser({
      ...user,
      subscription: {
        ...user.subscription,
        autoRenew: false,
      },
    });
  };

  const handleToggleAutoRenew = () => {
    // In a real app, call API to toggle auto-renew
    setUser({
      ...user,
      subscription: {
        ...user.subscription,
        autoRenew: !user.subscription.autoRenew,
      },
    });
    
    toast({
      title: user.subscription.autoRenew ? "Auto-renew disabled" : "Auto-renew enabled",
      description: user.subscription.autoRenew 
        ? "Your subscription will not renew automatically" 
        : "Your subscription will renew automatically",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <Button onClick={handleUpgrade}>
          Upgrade Plan
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription details and usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{user.subscription.plan}</h3>
                  <p className="text-muted-foreground">
                    ₹{user.subscription.price}/{user.subscription.billingCycle === "monthly" ? "month" : "year"}
                  </p>
                </div>
                <Badge variant={user.subscription.status === "active" ? "default" : "destructive"}>
                  {user.subscription.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Property Listings</span>
                  <span>{user.subscription.listings.used} of {user.subscription.listings.total} used</span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <p className="font-medium capitalize">{user.subscription.billingCycle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Next Billing Date</p>
                  <p className="font-medium">{new Date(user.subscription.expiresAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">
                    {user.subscription.paymentMethod.type === "card" && (
                      <span className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Card ending in {user.subscription.paymentMethod.last4}
                      </span>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Auto Renew</p>
                  <p className="font-medium">{user.subscription.autoRenew ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
              
              {daysLeft <= 7 && (
                <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Your subscription will {user.subscription.autoRenew ? "renew" : "expire"} in {daysLeft} days.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" onClick={handleToggleAutoRenew}>
                {user.subscription.autoRenew ? "Disable Auto-Renew" : "Enable Auto-Renew"}
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={!user.subscription.autoRenew}>
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
          
          {/* Plan Features */}
          {currentPlan && (
            <Card>
              <CardHeader>
                <CardTitle>Plan Features</CardTitle>
                <CardDescription>What's included in your {currentPlan.name} plan</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className={`h-4 w-4 mr-2 ${feature.included ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Upgrade Options */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Options</CardTitle>
              <CardDescription>Get more features with our premium plans</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans
                .filter(plan => plan.name !== user.subscription.plan && plan.userType === user.role)
                .map((plan) => (
                  <div key={plan.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                      </div>
                      <Badge variant="secondary">₹{plan.price}/mo</Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Check className="h-4 w-4 mr-2 text-green-500" />
                        <span>Up to {plan.maxListings} listings</span>
                      </div>
                      {plan.features
                        .filter(f => f.included)
                        .slice(0, 2)
                        .map((feature, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                            <span>{feature.name}</span>
                          </div>
                        ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center"
                      onClick={() => navigate(`/pricing?plan=${plan.id}`)}
                    >
                      Upgrade <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="link" onClick={() => navigate("/pricing")}>
                View all plans
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;