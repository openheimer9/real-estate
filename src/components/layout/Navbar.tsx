import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isAuthenticated = !!user;
  const userRole = user?.role || "renter";
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-foreground">RentSpace</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/explore" className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/explore' ? 'text-primary font-medium' : ''}`}>Explore</Link>
          <Link to="/pricing" className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/pricing' ? 'text-primary font-medium' : ''}`}>Pricing</Link>
          <Link to="/contact" className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/contact' ? 'text-primary font-medium' : ''}`}>Contact</Link>
          {/* In the Navbar component, update the condition for showing the List Property link */}
          {(isAuthenticated && (userRole === "owner" || userRole === "broker")) && (
            <Link to="/list-property" className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/list-property' ? 'text-primary font-medium' : ''}`}>List Property</Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => handleNavigation("/auth/login")}>Login</Button>
              <Button size="sm" className="btn-primary" onClick={() => handleNavigation("/auth/signup")}>Sign Up</Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/explore" className="text-foreground hover:text-primary transition-colors" onClick={() => setShowMobileMenu(false)}>Explore</Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors" onClick={() => setShowMobileMenu(false)}>Pricing</Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors" onClick={() => setShowMobileMenu(false)}>Contact</Link>
            {(isAuthenticated && (userRole === "owner" || userRole === "broker")) && (
              <Link to="/list-property" className="text-foreground hover:text-primary transition-colors" onClick={() => setShowMobileMenu(false)}>List Property</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;