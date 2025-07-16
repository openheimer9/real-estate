import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Bed, Bath, Car, Star, Heart, Filter, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import apartmentHero from "@/assets/apartment-hero.jpg";
import villaListing from "@/assets/villa-listing.jpg";

const Explore = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState<[number, number]>([5000, 100000]);
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [bhkType, setBhkType] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [favoriteListings, setFavoriteListings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mock data for listings
  const listings = [
    {
      id: 1,
      title: "Modern 2BHK Apartment",
      location: "Bandra West, Mumbai",
      price: 45000,
      originalPrice: 50000,
      image: apartmentHero,
      beds: 2,
      baths: 2,
      parking: true,
      furnished: true,
      rating: 4.8,
      type: "Apartment",
      featured: true,
      amenities: ["AC", "Gym", "Swimming Pool", "Power Backup"],
      postedDate: "2023-05-15",
    },
    {
      id: 2,
      title: "Spacious 3BHK Villa",
      location: "Koramangala, Bangalore",
      price: 65000,
      image: villaListing,
      beds: 3,
      baths: 3,
      parking: true,
      furnished: false,
      rating: 4.6,
      type: "Villa",
      amenities: ["Garden", "Security", "Power Backup"],
      postedDate: "2023-06-10",
    },
    {
      id: 3,
      title: "Cozy 1BHK Studio",
      location: "CP, New Delhi",
      price: 25000,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop",
      beds: 1,
      baths: 1,
      parking: false,
      furnished: true,
      rating: 4.5,
      type: "Studio",
      amenities: ["AC", "Lift"],
      postedDate: "2023-06-20",
    },
    {
      id: 4,
      title: "Luxury 4BHK Penthouse",
      location: "Jubilee Hills, Hyderabad",
      price: 85000,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
      beds: 4,
      baths: 4,
      parking: true,
      furnished: true,
      rating: 4.9,
      type: "Penthouse",
      amenities: ["AC", "Gym", "Swimming Pool", "Power Backup", "Terrace"],
      postedDate: "2023-05-05",
    },
  ];

  // Initialize from URL params
  useEffect(() => {
    const locationParam = searchParams.get("location");
    const budgetParam = searchParams.get("budget");
    
    if (locationParam) {
      setLocation(locationParam);
    }
    
    if (budgetParam) {
      const budgetValue = parseInt(budgetParam, 10);
      if (!isNaN(budgetValue)) {
        setBudget([5000, budgetValue]);
      }
    }
  }, [searchParams]);

  // Filter listings based on criteria
  const filteredListings = listings.filter(listing => {
    // Filter by location
    if (location && !listing.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    
    // Filter by budget
    if (listing.price < budget[0] || listing.price > budget[1]) {
      return false;
    }
    
    // Filter by property type
    if (propertyType.length > 0 && !propertyType.includes(listing.type)) {
      return false;
    }
    
    // Filter by BHK type
    if (bhkType.length > 0 && !bhkType.includes(`${listing.beds} BHK`)) {
      return false;
    }
    
    // Filter by amenities
    if (amenities.length > 0) {
      const hasAllAmenities = amenities.every(amenity => 
        listing.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }
    
    return true;
  });

  // Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default: // relevance
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
  });

  const handleSearch = useCallback(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (budget[1] !== 100000) params.set("budget", budget[1].toString());
    if (propertyType.length > 0) params.set("type", propertyType.join(","));
    if (bhkType.length > 0) params.set("bhk", bhkType.join(","));
    if (amenities.length > 0) params.set("amenities", amenities.join(","));
    if (sortBy !== "relevance") params.set("sort", sortBy);
    
    setSearchParams(params);
    
    toast({
      title: "Searching properties",
      description: `Found ${filteredListings.length} properties matching your criteria`,
    });
  }, [location, budget, propertyType, bhkType, amenities, sortBy, filteredListings.length, setSearchParams, toast]);

  const handleFavoriteToggle = useCallback((listingId: number) => {
    setFavoriteListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
    
    const isAdding = !favoriteListings.includes(listingId);
    toast({
      title: isAdding ? "Added to favorites" : "Removed from favorites",
      description: isAdding ? "Property saved to your favorites" : "Property removed from favorites",
    });
  }, [favoriteListings, toast]);

  const handlePropertyTypeToggle = useCallback((type: string) => {
    setPropertyType(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleBhkTypeToggle = useCallback((type: string) => {
    setBhkType(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const handleAmenityToggle = useCallback((amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setLocation("");
    setBudget([5000, 100000]);
    setPropertyType([]);
    setBhkType([]);
    setAmenities([]);
    setSortBy("relevance");
    setSearchParams({});
    
    toast({
      title: "Filters reset",
      description: "All search filters have been cleared",
    });
  }, [setSearchParams, toast]);

  const handlePropertyClick = useCallback((propertyId: number) => {
    navigate(`/listing/${propertyId}`);
  }, [navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Location */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Enter city or locality"
                      className="pl-9"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Budget */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Budget</Label>
                    <span className="text-sm text-muted-foreground">
                      ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                    </span>
                  </div>
                  <Slider
                    defaultValue={budget}
                    min={5000}
                    max={100000}
                    step={5000}
                    value={budget}
                    onValueChange={(value) => setBudget(value as [number, number])}
                    className="my-4"
                  />
                </div>
                
                {/* Property Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Property Type</Label>
                  <div className="space-y-2">
                    {["Apartment", "Villa", "House", "Studio", "Penthouse"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`type-${type}`} 
                          checked={propertyType.includes(type)}
                          onCheckedChange={() => handlePropertyTypeToggle(type)}
                        />
                        <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* BHK Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">BHK Type</Label>
                  <div className="space-y-2">
                    {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`bhk-${type}`} 
                          checked={bhkType.includes(type)}
                          onCheckedChange={() => handleBhkTypeToggle(type)}
                        />
                        <Label htmlFor={`bhk-${type}`} className="text-sm font-normal cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Amenities */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Amenities</Label>
                  <div className="space-y-2">
                    {["AC", "Lift", "Parking", "Furnished", "Power Backup", "Security", "Gym", "Swimming Pool"].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`amenity-${amenity}`} 
                          checked={amenities.includes(amenity)}
                          onCheckedChange={() => handleAmenityToggle(amenity)}
                        />
                        <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal cursor-pointer">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full btn-primary" onClick={handleSearch}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="bg-card rounded-lg border border-border p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by location, property name"
                    className="pl-9"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="md:hidden" onClick={() => setShowFilters(true)}>
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Active Filters */}
              {(propertyType.length > 0 || bhkType.length > 0 || amenities.length > 0 || budget[1] < 100000) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  {propertyType.map((type) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      {type}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handlePropertyTypeToggle(type)} />
                    </Badge>
                  ))}
                  {bhkType.map((type) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      {type}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleBhkTypeToggle(type)} />
                    </Badge>
                  ))}
                  {amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                      {amenity}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleAmenityToggle(amenity)} />
                    </Badge>
                  ))}
                  {budget[1] < 100000 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Budget: ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setBudget([5000, 100000])} />
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-6" onClick={resetFilters}>
                    Clear All
                  </Button>
                </div>
              )}
            </div>
            
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                {sortedListings.length} {sortedListings.length === 1 ? "Property" : "Properties"} {location ? `in ${location}` : ""}
              </h2>
            </div>
            
            {/* Property Listings */}
            {sortedListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden group cursor-pointer" onClick={() => handlePropertyClick(listing.id)}>
                    <div className="relative">
                      <img 
                        src={listing.image} 
                        alt={listing.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {listing.featured && (
                        <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                          Featured
                        </Badge>
                      )}
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(listing.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${favoriteListings.includes(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <div className="absolute bottom-3 left-3">
                        <span className="price-badge text-lg font-bold">
                          ₹{listing.price.toLocaleString()}/month
                        </span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {listing.type}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm ml-1">{listing.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-foreground mb-1">{listing.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {listing.location}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Bed className="h-4 w-4 mr-1" />
                            {listing.beds}
                          </span>
                          <span className="flex items-center">
                            <Bath className="h-4 w-4 mr-1" />
                            {listing.baths}
                          </span>
                          {listing.parking && (
                            <span className="flex items-center">
                              <Car className="h-4 w-4 mr-1" />
                              P
                            </span>
                          )}
                        </div>
                        {listing.furnished && (
                          <Badge variant="outline" className="text-xs">
                            Furnished
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed inset-x-0 bottom-0 top-16 bg-background border-t border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Location */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter city or locality"
                    className="pl-9"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Budget */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Budget</Label>
                  <span className="text-sm text-muted-foreground">
                    ₹{budget[0].toLocaleString()} - ₹{budget[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  defaultValue={budget}
                  min={5000}
                  max={100000}
                  step={5000}
                  value={budget}
                  onValueChange={(value) => setBudget(value as [number, number])}
                  className="my-4"
                />
              </div>
              
              {/* Property Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Property Type</Label>
                <div className="space-y-2">
                  {["Apartment", "Villa", "House", "Studio", "Penthouse"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-type-${type}`} 
                        checked={propertyType.includes(type)}
                        onCheckedChange={() => handlePropertyTypeToggle(type)}
                      />
                      <Label htmlFor={`mobile-type-${type}`} className="text-sm font-normal cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* BHK Type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">BHK Type</Label>
                <div className="space-y-2">
                  {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-bhk-${type}`} 
                        checked={bhkType.includes(type)}
                        onCheckedChange={() => handleBhkTypeToggle(type)}
                      />
                      <Label htmlFor={`mobile-bhk-${type}`} className="text-sm font-normal cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Amenities */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Amenities</Label>
                <div className="space-y-2">
                  {["AC", "Lift", "Parking", "Furnished", "Power Backup", "Security", "Gym", "Swimming Pool"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mobile-amenity-${amenity}`} 
                        checked={amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={`mobile-amenity-${amenity}`} className="text-sm font-normal cursor-pointer">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1" onClick={resetFilters}>
                  Reset
                </Button>
                <Button className="flex-1 btn-primary" onClick={() => {
                  handleSearch();
                  setShowFilters(false);
                }}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Explore;