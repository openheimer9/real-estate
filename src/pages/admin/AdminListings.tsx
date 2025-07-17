import { useState } from "react";
import { Eye, Flag, MoreHorizontal, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminListings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Mock listings data - in a real app, fetch this from your API
  const [listings, setListings] = useState([
    { id: 1, title: "Modern 2BHK Apartment", location: "Bandra West, Mumbai", owner: "John Doe", status: "active", featured: true, reports: 0, views: 145, created: "Jan 15, 2023" },
    { id: 2, title: "Spacious 3BHK Villa", location: "Koramangala, Bangalore", owner: "Raj Patel", status: "active", featured: false, reports: 0, views: 98, created: "Feb 20, 2023" },
    { id: 3, title: "Cozy 1BHK Studio", location: "Andheri East, Mumbai", owner: "Priya Singh", status: "inactive", featured: false, reports: 2, views: 56, created: "Mar 5, 2023" },
    { id: 4, title: "Luxury 4BHK Penthouse", location: "MG Road, Pune", owner: "Raj Patel", status: "active", featured: true, reports: 0, views: 210, created: "Apr 10, 2023" },
    { id: 5, title: "Budget 2BHK Flat", location: "Whitefield, Bangalore", owner: "Amit Kumar", status: "reported", featured: false, reports: 5, views: 78, created: "May 22, 2023" },
  ]);

  const handleDeleteListing = (listingId: number) => {
    // In a real app, call API to delete listing
    setListings(listings.filter(listing => listing.id !== listingId));
    
    toast({
      title: "Listing deleted",
      description: "The listing has been deleted successfully",
    });
  };

  const handleViewListing = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Manage Listings</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or location"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium">Title</th>
                  <th className="text-left py-3 px-4 font-medium">Location</th>
                  <th className="text-left py-3 px-4 font-medium">Owner</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Featured</th>
                  <th className="text-left py-3 px-4 font-medium">Reports</th>
                  <th className="text-left py-3 px-4 font-medium">Views</th>
                  <th className="text-left py-3 px-4 font-medium">Created</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">{listing.title}</td>
                    <td className="py-3 px-4">{listing.location}</td>
                    <td className="py-3 px-4">{listing.owner}</td>
                    <td className="py-3 px-4">
                      <Badge 
                        variant={
                        listing.status === "active" ? "default" :
                        listing.status === "reported" ? "destructive" :
                        "secondary"
                        }
                        className="capitalize"
                      >
                        {listing.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {listing.featured ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {listing.reports > 0 ? (
                        <Badge variant="destructive">{listing.reports}</Badge>
                      ) : (
                        <span>0</span>
                      )}
                    </td>
                    <td className="py-3 px-4">{listing.views}</td>
                    <td className="py-3 px-4">{listing.created}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewListing(listing.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteListing(listing.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminListings;