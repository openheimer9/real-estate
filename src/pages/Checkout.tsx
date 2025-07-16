import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Calendar, Lock, ArrowLeft, Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

const paymentSchema = z.object({
  cardName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z.string().regex(/^[0-9]{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.string().min(1, "Month is required"),
  expiryYear: z.string().min(1, "Year is required"),
  cvv: z.string().regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
  saveCard: z.boolean().optional(),
  billingAddress: z.object({
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().min(5, "ZIP code is required"),
    country: z.string().min(2, "Country is required"),
  }),
  paymentMethod: z.enum(["credit", "debit"]),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

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

const Checkout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  // Parse query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get("plan");
    const cycle = params.get("cycle") as "monthly" | "yearly";
    
    if (cycle && (cycle === "monthly" || cycle === "yearly")) {
      setBillingCycle(cycle);
    }
    
    // In a real app, fetch plan details from API based on planId
    // For now, use mock data
    if (planId) {
      const mockPlans: SubscriptionPlan[] = [
        {
          id: "basic-owner",
          name: "Basic",
          price: cycle === "monthly" ? 499 : 4999,
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
          price: cycle === "monthly" ? 999 : 9999,
          description: "Ideal for homeowners with multiple properties",
          features: [
            { name: "5 Property Listings", included: true },
            { name: "Advanced Analytics", included: true },
            { name: "Email & Chat Support", included: true },
            { name: "Featured Listing", included: true },
            { name: "AI Rent Suggestion", included: false },
            { name: "Priority Support", included: false },
          ],
          popular: true,
          maxListings: 5,
          userType: "owner",
        },
        {
          id: "premium-owner",
          name: "Premium",
          price: cycle === "monthly" ? 1999 : 19999,
          description: "Complete solution for property owners",
          features: [
            { name: "Unlimited Property Listings", included: true },
            { name: "Premium Analytics", included: true },
            { name: "24/7 Support", included: true },
            { name: "Featured Listings", included: true },
            { name: "AI Rent Suggestion", included: true },
            { name: "Priority Support", included: true },
          ],
          maxListings: 999,
          userType: "owner",
        },
      ];
      
      const plan = mockPlans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan(plan);
      } else {
        // If plan not found, redirect to pricing page
        navigate("/pricing");
      }
    } else {
      // If no plan selected, redirect to pricing page
      navigate("/pricing");
    }
  }, [location.search, navigate]);
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      saveCard: false,
      billingAddress: {
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
      },
      paymentMethod: "credit",
      termsAccepted: false,
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    setIsProcessing(true);
    
    // In a real app, send payment data to your payment processor
    console.log("Payment data:", data);
    console.log("Plan:", selectedPlan);
    console.log("Billing cycle:", billingCycle);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      toast({
        title: "Payment successful",
        description: `You have successfully subscribed to the ${selectedPlan?.name} plan.`,
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    }, 2000);
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return (
      <option key={month} value={month.toString().padStart(2, "0")}>
        {month.toString().padStart(2, "0")}
      </option>
    );
  });

  // Generate year options (current year + 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear + i;
    return (
      <option key={year} value={year.toString()}>
        {year}
      </option>
    );
  });

  if (!selectedPlan) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          <p>Loading plan details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate("/pricing")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to pricing
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete your purchase</CardTitle>
                <CardDescription>
                  Enter your payment details to subscribe to the {selectedPlan.name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="credit" id="credit" />
                                  <label htmlFor="credit" className="flex items-center cursor-pointer">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Credit Card
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="debit" id="debit" />
                                  <label htmlFor="debit" className="flex items-center cursor-pointer">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Debit Card
                                  </label>
                                </div>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Card Details</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cardholder Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Name on card" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    placeholder="1234 5678 9012 3456" 
                                    {...field} 
                                    onChange={(e) => {
                                      // Allow only numbers and format with spaces
                                      const value = e.target.value.replace(/\D/g, '');
                                      field.onChange(value);
                                    }}
                                    maxLength={16}
                                  />
                                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <FormLabel>Expiry Date</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              <FormField
                                control={form.control}
                                name="expiryMonth"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        {...field}
                                      >
                                        <option value="" disabled>MM</option>
                                        {monthOptions}
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="expiryYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        {...field}
                                      >
                                        <option value="" disabled>YYYY</option>
                                        {yearOptions}
                                      </select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input 
                                      placeholder="123" 
                                      type="password" 
                                      maxLength={4} 
                                      {...field} 
                                      onChange={(e) => {
                                        // Allow only numbers
                                        const value = e.target.value.replace(/\D/g, '');
                                        field.onChange(value);
                                      }}
                                    />
                                    <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="saveCard"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Save card for future payments
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  Your card information will be stored securely for future transactions.
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="billingAddress.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billingAddress.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Mumbai" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="billingAddress.state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="Maharashtra" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="billingAddress.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ZIP Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="400001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="billingAddress.country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="India" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>Pay ₹{selectedPlan.price}</>  
                      )}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      <div className="flex items-center justify-center">
                        <Lock className="h-4 w-4 mr-1" />
                        <span>Secure payment powered by Stripe</span>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{selectedPlan.name} Plan</span>
                    <span>₹{selectedPlan.price}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p>{billingCycle === "monthly" ? "Monthly" : "Annual"} subscription</p>
                    <p>Up to {selectedPlan.maxListings} property listings</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Plan Features</h4>
                    <ul className="space-y-2">
                      {selectedPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className={`h-4 w-4 mr-2 mt-0.5 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>₹{selectedPlan.price}</span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {billingCycle === "monthly" 
                      ? "Billed monthly. Cancel anytime." 
                      : "Billed annually. Save 16% compared to monthly billing."}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/50 flex flex-col items-start space-y-2 text-sm">
                <div className="flex items-start">
                  <Shield className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Subscription starts immediately</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;