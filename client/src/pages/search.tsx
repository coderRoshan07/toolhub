import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ToolCard } from '@/components/home/tool-card';
import { BackToTop } from '@/components/ui/back-to-top';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Tool } from '@shared/schema';

export default function SearchPage() {
  const [location] = useLocation();
  const query = new URLSearchParams(location.split('?')[1] || '');
  const searchTerm = query.get('q') || '';

  // Use React Query for search
  const { 
    data: searchResults = [] as Tool[], 
    isLoading,
    error 
  } = useQuery<Tool[]>({
    queryKey: ['/api/tools/search', searchTerm],
    queryFn: async () => {
      if (!searchTerm) return [];
      
      console.log(`Searching for: ${searchTerm}`);
      try {
        const response = await fetch(`/api/tools/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
          console.error(`Search request failed with status: ${response.status}`);
          throw new Error(`Search failed: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Found ${data.length} results:`, data);
        return data;
      } catch (error) {
        console.error('Search request error:', error);
        throw error;
      }
    },
    enabled: searchTerm.length > 0,
    retry: 1
  });
  
  // Log any errors
  useEffect(() => {
    if (error) {
      console.error('Search error:', error);
    }
  }, [error]);

  return (
    <>
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Search className="h-6 w-6 text-primary-500" />
            Search Results
          </h1>
          <p className="text-gray-700 font-medium">
            {searchTerm ? (
              <>
                Showing results for <span className="font-semibold text-primary-700">"{searchTerm}"</span>
                {searchResults.length > 0 && (
                  <span className="text-gray-700"> ({searchResults.length} results found)</span>
                )}
              </>
            ) : (
              'Enter a search term to find tools'
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 shadow-sm"></div>
                  <div>
                    <div className="h-5 bg-gray-200 rounded-full w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-full w-4/5 mb-4"></div>
                <div className="h-8 mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((tool: Tool) => {
              // Convert null to undefined for type compatibility with ToolCard
              return (
                <ToolCard 
                  key={tool.id} 
                  tool={{
                    ...tool,
                    iconName: tool.iconName || undefined,
                    iconUrl: tool.iconUrl || undefined,
                  } as any} 
                  showCategory={true} 
                />
              );
            })}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-20">
            <div className="mb-4 text-5xl">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No results found
            </h2>
            <p className="text-gray-700 font-medium max-w-md mx-auto mb-8">
              We couldn't find any tools matching "{searchTerm}". Try a different search term or browse our categories.
            </p>
            <Link 
              href="/"
              className="px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg inline-block"
            >
              Browse Categories
            </Link>
          </div>
        ) : null}
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
