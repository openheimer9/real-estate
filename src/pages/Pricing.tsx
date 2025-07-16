import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

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

const Pricing = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"owner" | "broker">("owner");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  const plans: SubscriptionPlan[] = [
    {
      id: "basic-owner",
      name: "Basic",
      price: billingCycle === "monthly" ? 499 : 4999,
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
      price: billingCycle === "monthly" ? 999 : 9999,
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
      price: billingCycle === "monthly" ? 1999 : 19999,
      description: "For serious property owners with multiple properties",
      features: [
        { name: "5 Property Listings", included: true },
        { name: "Premium Analytics", included: true },
        { name: "Priority Support", included: true },
        { name: "3 Featured Listings", included: true },
        { name: "AI Rent Suggestion", included: true },
        { name: "Verified Badge", included: true },
      ],
      maxListings: 5,
      userType: "owner",
    },
    {
      id: "basic-broker",
      name: "Broker Basic",
      price: billingCycle === "monthly" ? 1999 : 19999,
      description: "For real estate agents starting out",
      features: [
        { name: "10 Property Listings", included: true },
        { name: "Broker Profile", included: true },
        { name: "Basic Analytics", included: true },
        { name: "Email Support", included: true },
        { name: "Featured Listings", included: false },
        { name: "AI Rent Suggestion", included: false },
      ],
      maxListings: 10,
      userType: "broker",
    },
    {
      id: "pro-broker",
      name: "Broker Pro",
      price: billingCycle === "monthly" ? 3999 : 39999,
      description: "For established real estate agencies",
      features: [
        { name: "25 Property Listings", included: true },
        { name: "Enhanced Broker Profile", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Priority Support", included: true },
        { name: "5 Featured Listings", included: true },
        { name: "AI Rent Suggestion", included: true },
      ],
      popular: true,
      maxListings: 25,
      userType: "broker",
    },
    {
      id: "unlimited-broker",
      name: "Broker Unlimited",
      price: billingCycle === "monthly" ? 7999 : 79999,
      description: "For large agencies with unlimited needs",
      features: [
        { name: "Unlimited Property Listings", included: true },
        { name: "Premium Broker Profile", included: true },
        { name: "Premium Analytics", included: true },
        { name: "24/7 Support", included: true },
        { name: "10 Featured Listings", included: true },
        { name: "AI Rent Suggestion & Tools", included: true },
      ],
      maxListings: Infinity,
      userType: "broker",
    },
  ];

  const filteredPlans = plans.filter(
    (plan) => plan.userType === userType || plan.userType === "both"
  );

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    toast({
      title: `${plan.name} plan selected`,
      description: `You've selected the ${plan.name} plan with ${plan.maxListings} listings`,
    });
    
    // Navigate to checkout with plan details
    navigate(`/checkout?plan=${plan.id}&cycle=${billingCycle}`);
  };

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Subscription Plans</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your real estate needs
          </p>
          
          <div className="flex justify-center mt-8 space-x-4">
            <div className="inline-flex items-center bg-secondary rounded-lg p-1">
              <Button
                variant={userType === "owner" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("owner")}
                className={userType === "owner" ? "" : "hover:bg-secondary"}
              >
                Property Owner
              </Button>
              <Button
                variant={userType === "broker" ? "default" : "ghost"}
                size="sm"
                onClick={() => setUserType("broker")}
                className={userType === "broker" ? "" : "hover:bg-secondary"}
              >
                Broker/Agency
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center mt-4 space-x-4">
            <div className="inline-flex items-center bg-secondary rounded-lg p-1">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
                className={billingCycle === "monthly" ? "" : "hover:bg-secondary"}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === "yearly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("yearly")}
                className={billingCycle === "yearly" ? "" : "hover:bg-secondary"}
              >
                Yearly (Save 15%)
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`mr-2 mt-1 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`}>
                        {feature.included ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="block h-4 w-4 rounded-full border border-muted-foreground"></span>
                        )}
                      </div>
                      <span className={feature.included ? 'text-foreground' : 'text-muted-foreground'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className={`w-full ${plan.popular ? 'btn-primary' : ''}`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Need a custom plan?</h2>
          <p className="text-muted-foreground mb-6">Contact us for custom enterprise solutions for large agencies</p>
          <Button variant="outline" size="lg" onClick={() => navigate("/contact")}>
            Contact Sales
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Pricing;