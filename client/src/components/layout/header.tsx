import { Link } from "wouter";
import { SearchBar } from "@/components/ui/search";
import { useMobile } from "@/hooks/use-mobile";
import { Drill, Compass, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const isMobile = useMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Design', href: '/category/design' },
    { name: 'Productivity', href: '/category/productivity' },
    { name: 'Development', href: '/category/development' },
    { name: 'All Categories', href: '/category/all' },
  ];
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <div className="flex w-full md:w-auto justify-between items-center">
          <Link href="/" className="flex items-center group cursor-pointer">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-1.5 rounded-lg shadow-sm mr-2 transition-transform duration-300 group-hover:scale-110">
              <Drill className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-primary-800">Tool</span>
              <span>Finder</span>
            </h1>
          </Link>
          
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        {(!isMobile || mobileMenuOpen) && (
          <nav className={`${isMobile ? 'w-full mt-4 pb-2' : ''} transition-all duration-200`}>
            <ul className={`flex ${isMobile ? 'flex-col space-y-2' : 'flex-row space-x-1'} items-center`}>
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-md transition-colors duration-150 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        
        <div className={`${isMobile ? 'w-full mt-4' : 'w-1/3 ml-4'}`}>
          <SearchBar placeholder="Search for tools..." />
        </div>
      </div>
    </header>
  );
}
