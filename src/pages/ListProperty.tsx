import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, Upload, Plus, X, Home, Building, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { API_URL } from '../config';

// Define property types that match your backend model
const propertyTypes = ["Apartment", "Villa", "House", "Office", "Shop", "Land"] as const;
const propertyStatuses = ["For Rent", "For Sale"] as const;

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Location is required"),
  price: z.number().positive("Price must be a positive number"),
  beds: z.number().int().min(0, "Number of beds must be 0 or more"),
  baths: z.number().int().min(0, "Number of baths must be 0 or more"),
  parking: z.boolean().default(false),
  furnished: z.boolean().default(false),
  area: z.number().positive("Area must be a positive number"),
  type: z.enum(propertyTypes),
  status: z.enum(propertyStatuses),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const ListProperty = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Apartment",
      bhkType: "2 BHK",
      rent: "",
      location: "",
      address: "",
      furnished: "Unfurnished",
      bedrooms: "2",
      bathrooms: "2",
      area: "",
      parking: false,
      petFriendly: false,
      ac: false,
      gym: false,
      swimmingPool: false,
      powerBackup: false,
      security: false,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Limit to 10 images
      if (images.length + newFiles.length > 10) {
        toast({
          title: "Too many images",
          description: "You can upload a maximum of 10 images",
          variant: "destructive",
        });
        return;
      }
      
      setImages([...images, ...newFiles]);
      
      // Create URLs for preview
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...imageUrls];
    const newUploadedUrls = [...uploadedImageUrls];
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(newUrls[index]);
    
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    if (newUploadedUrls[index]) {
      newUploadedUrls.splice(index, 1);
    }
    
    setImages(newImages);
    setImageUrls(newUrls);
    setUploadedImageUrls(newUploadedUrls);
  };

  // In the uploadImagesToCloudinary function, update the fetch URL
  const uploadImagesToCloudinary = async () => {
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    
    try {
      for (const image of images) {
        const formData = new FormData();
        formData.append('image', image);
        
        const response = await fetch(`${API_URL}/property/upload-image`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        uploadedUrls.push(data.url);
      }
      
      setUploadedImageUrls(uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error('Image upload error:', error);
      toast({
        title: "Image upload failed",
        description: "There was an error uploading your images. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  // In the onSubmit function, update the fetch URL
  const onSubmit = async (data: PropertyFormValues) => {
    // Check if at least one image is uploaded
    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image of your property",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // First upload images to Cloudinary
      const imageUrls = await uploadImagesToCloudinary();
      
      // Then create property with image URLs
      const propertyData = {
        ...data,
        // Ensure numeric values are properly converted
        price: Number(data.price),
        beds: Number(data.beds),
        baths: Number(data.baths),
        area: Number(data.area),
        images: imageUrls,
      };
      
      const response = await fetch(`${API_URL}/property/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(propertyData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create property listing');
      }
      
      toast({
        title: "Property listed successfully",
        description: "Your property has been listed for rent",
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error('Property submission error:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">List Your Property</h1>
            <p className="text-muted-foreground">Fill in the details below to list your property for rent</p>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Modern 2BHK Apartment with Sea View" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your property, highlight key features, nearby landmarks, etc." 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select property type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Apartment">Apartment</SelectItem>
                                <SelectItem value="House">House</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Studio">Studio</SelectItem>
                                <SelectItem value="PG">PG</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bhkType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>BHK Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select BHK type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1 BHK">1 BHK</SelectItem>
                                <SelectItem value="2 BHK">2 BHK</SelectItem>
                                <SelectItem value="3 BHK">3 BHK</SelectItem>
                                <SelectItem value="4 BHK">4 BHK</SelectItem>
                                <SelectItem value="5+ BHK">5+ BHK</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Location</h2>
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/Locality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Bandra West, Mumbai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter the complete address of your property" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Property Details */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Property Details</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="rent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Rent (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 25000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                        name="furnished"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Furnishing</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select furnishing type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                                <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                                <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bedrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bedrooms</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of bedrooms" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5+">5+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bathrooms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bathrooms</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select number of bathrooms" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5+">5+</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="parking"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Parking</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="petFriendly"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Pet Friendly</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ac"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Air Conditioning</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="gym"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Gym</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="swimmingPool"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Swimming Pool</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="powerBackup"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Power Backup</FormLabel>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="security"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer">Security</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Images */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Property Images</h2>
                    <p className="text-sm text-muted-foreground">Upload up to 10 high-quality images of your property</p>
                    
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB each</p>
                          <Button type="button" variant="outline" size="sm">
                            Select Files
                          </Button>
                        </div>
                      </label>
                    </div>
                    
                    {imageUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={url} 
                              alt={`Property image ${index + 1}`} 
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button type="submit" className="w-full md:w-auto btn-primary">
                      List Property
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ListProperty;