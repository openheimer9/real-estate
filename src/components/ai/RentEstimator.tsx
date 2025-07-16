import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const estimatorSchema = z.object({
  location: z.string().min(3, "Location is required"),
  area: z.string().min(1, "Area is required"),
  bhkType: z.string().min(1, "BHK type is required"),
  furnished: z.string().min(1, "Furnishing status is required"),
});

type EstimatorFormValues = z.infer<typeof estimatorSchema>;

const RentEstimator = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedRent, setEstimatedRent] = useState<number | null>(null);
  const [rentRange, setRentRange] = useState<{min: number, max: number} | null>(null);
  
  const form = useForm<EstimatorFormValues>({
    resolver: zodResolver(estimatorSchema),
    defaultValues: {
      location: "",
      area: "",
      bhkType: "",
      furnished: "",
    },
  });

  const onSubmit = (data: EstimatorFormValues) => {
    setIsCalculating(true);
    
    // Mock AI calculation - in a real app, this would be an API call to your AI service
    setTimeout(() => {
      // Simple calculation for demo purposes
      const baseRent = {
        "Mumbai": 25000,
        "Delhi": 20000,
        "Bangalore": 22000,
        "Pune": 18000,
        "Hyderabad": 16000,
        "Chennai": 15000,
      }[data.location.split(',')[0]] || 15000;
      
      const bhkMultiplier = {
        "1 BHK": 1,
        "2 BHK": 1.5,
        "3 BHK": 2,
        "4 BHK": 2.5,
        "5+ BHK": 3,
      }[data.bhkType] || 1;
      
      const furnishedMultiplier = {
        "Fully Furnished": 1.2,
        "Semi Furnished": 1.1,
        "Unfurnished": 1,
      }[data.furnished] || 1;
      
      const areaFactor = parseInt(data.area) / 1000;
      
      const calculatedRent = Math.round(baseRent * bhkMultiplier * furnishedMultiplier * areaFactor);
      
      // Set a range for the estimated rent
      const minRent = Math.round(calculatedRent * 0.9);
      const maxRent = Math.round(calculatedRent * 1.1);
      
      setEstimatedRent(calculatedRent);
      setRentRange({ min: minRent, max: maxRent });
      setIsCalculating(false);
    }, 2000); // Simulate API delay
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          AI Rent Estimator
        </CardTitle>
        <CardDescription>
          Get an AI-powered estimate of the rental value for your property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Mumbai, Bandra West" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (sq ft)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 1200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bhkType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BHK Type