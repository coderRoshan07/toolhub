import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

interface SearchProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
  className?: string;
}

export function SearchBar({ 
  placeholder = "Search for tools...", 
  onSearch, 
  className = "" 
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // No debounce effect, we'll only search on submit
  
  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      console.log('Search form submitted with term:', trimmedSearch);
      // Call the onSearch prop if provided
      if (onSearch) {
        onSearch(trimmedSearch);
      }
      // Navigate to search page with query parameter
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    }
  };

  // Handle key press events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default form submission
      handleSubmit(e);
    }
  };
  
  // Handle search icon click
  const handleIconClick = () => {
    if (inputRef.current) {
      if (searchTerm.trim()) {
        // Create and submit form event
        const event = new Event('submit') as unknown as React.FormEvent;
        handleSubmit(event);
      } else {
        // If search field is empty, just focus it
        inputRef.current.focus();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full pl-4 pr-10 py-2 rounded-lg border focus:ring-2 focus:ring-primary focus:border-primary"
      />
      <button 
        type="submit"
        className="absolute right-3 top-2.5 text-gray-400 hover:text-primary-500 cursor-pointer transition-colors bg-transparent border-none p-0 m-0"
        onClick={handleIconClick}
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
}
