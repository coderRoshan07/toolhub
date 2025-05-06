import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CategoryGrid } from "@/components/home/category-grid";
import { ToolCard } from "@/components/home/tool-card";
import { CTASection } from "@/components/home/cta-section";
import { BackToTop } from "@/components/ui/back-to-top";
import * as Lucide from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: popularTools = [], isLoading: popularLoading } = useQuery<any[]>({
    queryKey: ['/api/tools/popular']
  });

  const { data: newTools = [], isLoading: newLoading } = useQuery<any[]>({
    queryKey: ['/api/tools/new']
  });

  // Dynamic icon rendering from lucide-react
  const getLucideIcon = (iconName: string, className: string) => {
    const IconComponent = (Lucide as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, x => x[1].toUpperCase())];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 py-10 px-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl text-center border border-gray-200 shadow-md">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
              Find the Best <span className="text-primary-600">Free Online Tools</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-800 max-w-3xl mx-auto mb-8 font-medium">
              Your one-stop directory of the most useful free online tools across various categories. 
              No registration, no downloads - just direct access to the tools you need.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link 
                href="/category/design"
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg inline-block border-2 border-black"
              >
                Explore Design Tools
              </Link>
              <Link
                href="/category/productivity"
                className="px-6 py-3 bg-black hover:bg-gray-800 text-white font-bold rounded-lg border-2 border-black transition-colors shadow-md hover:shadow-lg inline-block"
              >
                Productivity Tools
              </Link>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <CategoryGrid />

        {/* Popular Tools */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-grow">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
                Popular Tools
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
              </h2>
            </div>
            <Link 
              href="/tools"
              className="bg-black hover:bg-gray-800 text-white font-bold flex items-center text-sm md:text-base transition-colors duration-200 px-4 py-2 rounded-lg border-2 border-black shadow-md hover:shadow-lg"
            >
              View all <Lucide.ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularLoading ? (
              Array(6).fill(0).map((_, index) => (
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
              ))
            ) : (
              popularTools?.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))
            )}
          </div>
        </section>

        {/* Recently Added Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-grow">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative flex items-center">
                <Lucide.Clock className="h-6 w-6 text-primary-500 mr-2" />
                Recently Added
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newLoading ? (
              Array(3).fill(0).map((_, index) => (
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
                    <div className="h-4 bg-green-100 rounded-full w-12"></div>
                  </div>
                </div>
              ))
            ) : (
              newTools?.map((tool) => (
                <ToolCard key={tool.id} tool={tool} isNew={true} />
              ))
            )}
          </div>
        </section>
      </main>

      <CTASection />
      
      <Footer />
      <BackToTop />
    </>
  );
}
