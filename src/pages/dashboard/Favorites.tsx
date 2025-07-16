import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, MapPin, Bed, Bath, Car, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Import sample images
import apartmentHero from "@/assets/apartment-hero.jpg";
import villaListing from "@/assets/villa-listing.jpg";

const Favorites = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState<number | null>(null);
  
  // Mock favorites data - in a real app, fetch this from your API
  const [favorites, setFavorites] = useState([
    {
      id: 1,
      title: "Modern 2BHK Apartment with Sea View",
      location: "Bandra West, Mumbai",
      price: "₹45,000",
      image: apartmentHero,
      beds: 2,
      baths: 2,
      parking: true,
      furnished: true,
      rating: 4.8,
      type: "Apartment",
      savedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Spacious 3BHK Villa with Garden",
      location: "Koramangala, Bangalore",
      price: "₹65,000",
      image: villaListing,
      beds: 3,
      baths: 3,
      parking: true,
      furnished: false,
      rating: 4.6,
      type: "Villa",
      savedDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Cozy 1BHK Studio Apartment",
      location: "CP, New Delhi",
      price: "₹25,000",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop",
      beds: 1,
      baths: 1,
      parking: false,
      furnished: true,
      rating: 4.5,
      type: "Studio",
      savedDate: "2024-02-05",
    },
  ]);

  const handleViewProperty = (id: number) => {
    navigate(`/listing/${id}`);
  };

  const handleRemoveFavorite = (id: number) => {
    setSelectedFavorite(id);
    setDeleteDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (selectedFavorite) {
      // In a real app, call API to remove from favorites
      setFavorites(favorites.filter(favorite => favorite.id !== selectedFavorite));
      
      toast({
        title: "Removed from favorites",
        description: "Property removed from your favorites",
      });
      
      setDeleteDialogOpen(false);
      setSelectedFavorite(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Saved Properties</h1>
        <Button onClick={() => navigate("/explore")} variant="outline">
          Explore More Properties
        </Button>
      </div>
      
      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved properties</h2>
          <p className="text-muted-foreground mb-4">Properties you save will appear here</p>
          <Button onClick={() => navigate("/explore")}>
            Browse Properties
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-primary">
                  {property.type}
                </Badge>
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/70 text-white text-sm px-2 py-1 rounded-md">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{property.rating}</span>
                </div>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute bottom-2 right-2 rounded-full" 
                  onClick={() => handleRemoveFavorite(property.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div onClick={() => handleViewProperty(property.id)} className="cursor-pointer">
                    <h3 className="font-semibold truncate hover:text-primary transition-colors">{property.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg">{property.price}/month</p>
                    <Button size="sm" variant="outline" onClick={() => handleViewProperty(property.id)}>
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> View
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                    <div className="flex items-center">
                      <Bed className="h-3.5 w-3.5 mr-1" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-3.5 w-3.5 mr-1" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Car className="h-3.5 w-3.5 mr-1" />
                      <span>{property.parking ? "Yes" : "No"}</span>
                    </div>
                    <div>
                      <span>{property.furnished ? "Furnished" : "Unfurnished"}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Saved on: {new Date(property.savedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from Favorites</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this property from your favorites?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveConfirm}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Favorites;