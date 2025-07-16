import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">RentSpace</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Making rental search simple and transparent across India.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">For Renters</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/explore" className="hover:text-primary transition-colors">Search Properties</Link></li>
              <li><Link to="/dashboard/favorites" className="hover:text-primary transition-colors">Saved Properties</Link></li>
              <li><Link to="/rent-calculator" className="hover:text-primary transition-colors">Rent Calculator</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">For Owners</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/list-property" className="hover:text-primary transition-colors">List Property</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Owner Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} RentSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;