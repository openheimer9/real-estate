import { Search, MapPin, Bed, Bath, Car, Star, Heart, Filter, Home, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import apartmentHero from "@/assets/apartment-hero.jpg";
import villaListing from "@/assets/villa-listing.jpg";
import Layout from "@/components/layout/Layout";

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchBudget, setSearchBudget] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [favoriteListings, setFavoriteListings] = useState<number[]>([]);

  const featuredListings = [
    {
      id: 1,
      title: "Modern 2BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹45,000",
      originalPrice: "₹50,000",
      image: apartmentHero,
      beds: 2,
      baths: 2,
      parking: true,
      furnished: true,
      rating: 4.8,
      type: "Apartment",
      featured: true,
    },
    {
      id: 2,
      title: "Spacious 3BHK Villa",
      location: "Koramangala, Bangalore",
      price: "₹65,000",
      image: villaListing,
      beds: 3,
      baths: 3,
      parking: true,
      furnished: false,
      rating: 4.6,
      type: "Villa",
    },
    {
      id: 3,
      title: "Cozy 1BHK Studio",
      location: "CP, New Delhi",
      price: "₹25,000",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop",
      beds: 1,
      baths: 1,
      parking: false,
      furnished: true,
      rating: 4.5,
      type: "Studio",
    },
  ];

  const popularLocations = [
    { name: "Mumbai", properties: 1240, icon: Home },
    { name: "Bangalore", properties: 890, icon: TrendingUp },
    { name: "Delhi", properties: 750, icon: Users },
    { name: "Pune", properties: 620, icon: Home },
  ];

  const features = [
    {
      title: "Verified Properties",
      description: "All listings are verified by our team",
      icon: "✓"
    },
    {
      title: "Direct Contact",
      description: "Connect directly with owners & brokers",
      icon: "📞"
    },
    {
      title: "Smart Search",
      description: "AI-powered recommendations",
      icon: "🤖"
    },
    {
      title: "Secure Payments",
      description: "Safe and secure payment processing",
      icon: "🔒"
    }
  ];

  // Event handlers
  const handleSearch = useCallback(() => {
    if (!searchLocation.trim()) {
      toast({
        title: "Please enter a location",
        description: "Location is required for search",
        variant: "destructive"
      });
      return;
    }
    navigate(`/explore?location=${encodeURIComponent(searchLocation)}&budget=${encodeURIComponent(searchBudget)}`);
  }, [searchLocation, searchBudget, toast, navigate]);

  const handleFilterToggle = useCallback((filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  }, []);

  const handleFavoriteToggle = useCallback((listingId: number) => {
    setFavoriteListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  }, []);

  const handleLocationClick = useCallback((location: string) => {
    navigate(`/explore?location=${encodeURIComponent(location)}`);
  }, [navigate]);

  const handlePropertyClick = useCallback((listing: {
    id: number;
    title: string;
    location: string;
    price: string;
    image: string;
    beds: number;
    baths: number;
    parking: boolean;
    furnished: boolean;
    rating: number;
    type: string;
    featured?: boolean;
    originalPrice?: string;
  }) => {
    navigate(`/listing/${listing.id}`);
  }, [navigate]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect
            <span className="block">Rental Home</span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Discover thousands of verified rental properties across India. 
            Connect directly with owners and brokers.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-6 shadow-xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Enter city, locality or landmark"
                    className="pl-10 search-input"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Input 
                  placeholder="Budget (₹)" 
                  className="search-input" 
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                />
              </div>
              <Button className="btn-primary h-12" onClick={handleSearch}>
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {['1 BHK', '2 BHK', '3 BHK', 'Furnished', 'Pet Friendly', 'Parking'].map((filter) => (
                <div 
                  key={filter} 
                  className={`filter-chip ${activeFilters.includes(filter) ? 'active' : ''}`}
                  onClick={() => handleFilterToggle(filter)}
                >
                  {filter}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Why Choose RentSpace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="property-card text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
            <Link to="/explore">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                All Filters
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="property-card overflow-hidden group cursor-pointer" onClick={() => handlePropertyClick(listing)}>
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
                      {listing.price}/month
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
          
          <div className="text-center mt-8">
            <Link to="/explore">
              <Button size="lg" className="btn-primary">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Popular Locations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularLocations.map((location) => (
              <Card key={location.name} className="property-card text-center p-6 cursor-pointer" onClick={() => handleLocationClick(location.name)}>
                <location.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{location.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {location.properties}+ properties
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 hero-gradient">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of property owners and brokers who trust RentSpace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/list-property">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                List Your Property
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
);

};
export default Index;
