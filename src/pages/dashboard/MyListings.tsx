import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Plus, MoreHorizontal, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Import sample images
import apartmentHero from "@/assets/apartment-hero.jpg";
import villaListing from "@/assets/villa-listing.jpg";

const MyListings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  // Mock listings data - in a real app, fetch this from your API
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Modern 2BHK Apartment with Sea View",
      location: "Bandra West, Mumbai",
      price: "₹45,000",
      image: apartmentHero,
      beds: 2,
      baths: 2,
      area: "1200 sq.ft",
      type: "Apartment",
      status: "active",
      stats: {
        views: 145,
        inquiries: 12,
        favorites: 8,
      },
      postedDate: "2023-12-15",
    },
    {
      id: 2,
      title: "Spacious 3BHK Villa with Garden",
      location: "Koramangala, Bangalore",
      price: "₹65,000",
      image: villaListing,
      beds: 3,
      baths: 3,
      area: "2200 sq.ft",
      type: "Villa",
      status: "active",
      stats: {
        views: 98,
        inquiries: 7,
        favorites: 5,
      },
      postedDate: "2024-01-10",
    },
    {
      id: 3,
      title: "Cozy 1BHK Studio Apartment",
      location: "CP, New Delhi",
      price: "₹25,000",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop",
      beds: 1,
      baths: 1,
      area: "650 sq.ft",
      type: "Studio",
      status: "rented",
      stats: {
        views: 210,
        inquiries: 18,
        favorites: 12,
      },
      postedDate: "2023-11-05",
      rentedDate: "2024-01-20",
    },
  ]);

  const handleEditListing = (id: number) => {
    // In a real app, navigate to edit page with the listing ID
    navigate(`/edit-property/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedListing(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedListing) {
      // In a real app, call API to delete the listing
      setListings(listings.filter(listing => listing.id !== selectedListing));
      
      toast({
        title: "Listing deleted",
        description: "Your property listing has been removed",
      });
      
      setDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  const handleViewListing = (id: number) => {
    // Navigate to the listing detail page
    navigate(`/listing/${id}`);
  };

  const handleStatusChange = (id: number, newStatus: "active" | "rented" | "inactive") => {
    // Update listing status
    setListings(listings.map(listing => {
      if (listing.id === id) {
        return {
          ...listing,
          status: newStatus,
          rentedDate: newStatus === "rented" ? new Date().toISOString().split('T')[0] : undefined,
        };
      }
      return listing;
    }));
    
    toast({
      title: "Status updated",
      description: `Listing marked as ${newStatus}`,
    });
  };

  const filteredListings = listings.filter(listing => {
    if (activeTab === "all") return true;
    return listing.status === activeTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Listings</h1>
        <Button onClick={() => navigate("/list-property")} className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> Add New Listing
        </Button>
      </div>
      
      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="rented">Rented</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          {filteredListings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No {activeTab} listings found.</p>
              {activeTab !== "all" && (
                <Button variant="link" onClick={() => setActiveTab("all")}>
                  View all listings
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing) => (
                <Card key={listing.id}>
                  <div className="relative">
                    <img 
                      src={listing.image} 
                      alt={listing.title} 
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${listing.status === 'active' ? 'bg-green-500' : listing.status === 'rented' ? 'bg-blue-500' : 'bg-gray-500'}`}
                    >
                      {listing.status === 'active' ? 'Active' : listing.status === 'rented' ? 'Rented' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">{listing.location}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditListing(listing.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewListing(listing.id)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          {listing.status !== "active" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(listing.id, "active")}>
                              <Check className="mr-2 h-4 w-4" /> Mark as Active
                            </DropdownMenuItem>
                          )}
                          {listing.status !== "rented" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(listing.id, "rented")}>
                              <Check className="mr-2 h-4 w-4" /> Mark as Rented
                            </DropdownMenuItem>
                          )}
                          {listing.status !== "inactive" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(listing.id, "inactive")}>
                              <X className="mr-2 h-4 w-4" /> Mark as Inactive
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(listing.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-semibold text-lg">{listing.price}/month</p>
                      <p className="text-sm text-muted-foreground">{listing.type}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <span>{listing.beds} Beds</span>
                        <span className="mx-2">•</span>
                        <span>{listing.baths} Baths</span>
                        <span className="mx-2">•</span>
                        <span>{listing.area}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-sm font-medium">{listing.stats.views}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{listing.stats.inquiries}</p>
                          <p className="text-xs text-muted-foreground">Inquiries</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{listing.stats.favorites}</p>
                          <p className="text-xs text-muted-foreground">Saves</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-3">
                      <p>Posted: {new Date(listing.postedDate).toLocaleDateString()}</p>
                      {listing.rentedDate && (
                        <p>Rented: {new Date(listing.rentedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyListings;