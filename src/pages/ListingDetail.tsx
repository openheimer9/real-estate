import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Bed, Bath, Car, Star, Heart, Share2, Calendar, Phone, MessageSquare, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

// Import sample images
import apartmentHero from "@/assets/apartment-hero.jpg";
import villaListing from "@/assets/villa-listing.jpg";

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  // Mock listing data - in a real app, fetch this based on the ID
  const listing = {
    id: parseInt(id || "1"),
    title: "Modern 2BHK Apartment with Sea View",
    description: "This beautiful apartment offers stunning sea views and modern amenities. Located in a prime area with easy access to shopping, restaurants, and public transportation. The apartment features a spacious living room, fully equipped kitchen, and two comfortable bedrooms.",
    location: "Bandra West, Mumbai",
    price: 45000,
    originalPrice: 50000,
    images: [
      apartmentHero,
      villaListing,
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop",
    ],
    beds: 2,
    baths: 2,
    area: 1200, // sq ft
    parking: true,
    furnished: true,
    rating: 4.8,
    type: "Apartment",
    featured: true,
    amenities: [
      "Air Conditioning",
      "Gym",
      "Swimming Pool",
      "24/7 Security",
      "Power Backup",
      "Wifi",
      "Modular Kitchen",
      "Balcony",
    ],
    postedDate: "2023-05-15",
    availableFrom: "2023-07-01",
    owner: {
      name: "Priya Sharma",
      type: "Owner", // or "Broker"
      phone: "+91 98765 43210",
      responseRate: 95, // percentage
      responseTime: "within 2 hours",
      profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    nearbyPlaces: [
      { name: "City Mall", distance: "0.5 km" },
      { name: "Metro Station", distance: "1 km" },
      { name: "Hospital", distance: "2 km" },
      { name: "School", distance: "1.5 km" },
    ],
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Property removed from your favorites" : "Property saved to your favorites",
    });
  };

  const handleShare = () => {
    // In a real app, implement proper sharing functionality
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard",
      description: "You can now share this property with others",
    });
  };

  const handleContactSubmit = () => {
    toast({
      title: "Message sent",
      description: "The owner will get back to you soon",
    });
    setContactMessage("");
    setShowContactDialog(false);
  };

  const handleCallOwner = () => {
    toast({
      title: "Calling owner",
      description: `Connecting you to ${listing.owner.name}`,
    });
    // In a real app, implement proper calling functionality or reveal phone number
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Link to="/explore" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to search results
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="rounded-lg overflow-hidden mb-2">
                <img 
                  src={listing.images[activeImageIndex]} 
                  alt={listing.title}
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {listing.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg overflow-hidden cursor-pointer ${index === activeImageIndex ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${listing.title} - Image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Property Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-accent text-accent-foreground">
                  {listing.type}
                </Badge>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleFavoriteToggle}
                    className={isFavorite ? "text-red-500" : ""}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-red-500' : ''}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">{listing.title}</h1>
              
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{listing.location}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-foreground">₹{listing.price.toLocaleString()}</span>
                  <span className="text-muted-foreground">/month</span>
                  {listing.originalPrice && listing.originalPrice > listing.price && (
                    <span className="text-sm text-muted-foreground line-through ml-2">
                      ₹{listing.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="ml-1 font-medium">{listing.rating}</span>
                </div>
              </div>
            </div>
            
            {/* Property Details */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Bed className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-medium">{listing.beds} Beds</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Bath className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-medium">{listing.baths} Baths</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="M3 15L15 3" />
                </svg>
                <div className="text-sm font-medium">{listing.area} sq.ft</div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-lg">
                <Car className="h-5 w-5 mx-auto mb-1" />
                <div className="text-sm font-medium">{listing.parking ? "Parking" : "No Parking"}</div>
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs defaultValue="description" className="mb-8">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="p-4 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-2">About this property</h3>
                <p className="text-muted-foreground mb-4">{listing.description}</p>
                
                <h4 className="font-medium mb-2">Property Details</h4>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Property Type: {listing.type}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Furnishing: {listing.furnished ? "Furnished" : "Unfurnished"}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Available From: {new Date(listing.availableFrom).toLocaleDateString()}
                  </li>
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    Posted On: {new Date(listing.postedDate).toLocaleDateString()}
                  </li>
                </ul>
              </TabsContent>
              
              <TabsContent value="amenities" className="p-4 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">Amenities & Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center">
                      <Check className="h-4 w-4 text-primary mr-2" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="p-4 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4">Location & Nearby</h3>
                
                {/* Map placeholder - in a real app, integrate Google Maps or similar */}
                <div className="bg-secondary h-48 rounded-lg mb-4 flex items-center justify-center">
                  <p className="text-muted-foreground">Map view would be displayed here</p>
                </div>
                
                <h4 className="font-medium mb-2">Nearby Places</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="font-medium">Restaurants</p>
                    <p className="text-sm text-muted-foreground">5 within 1km</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="font-medium">Schools</p>
                    <p className="text-sm text-muted-foreground">3 within 2km</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="font-medium">Parks</p>
                    <p className="text-sm text-muted-foreground">2 within 1km</p>
                  </div>
                  <div className="p-2 bg-secondary/50 rounded">
                    <p className="font-medium">Shopping</p>
                    <p className="text-sm text-muted-foreground">4 within 3km</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetail;