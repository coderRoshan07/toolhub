import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ToolCard } from "@/components/home/tool-card";
import * as Lucide from "lucide-react";

export default function CategoryPage() {
  const [match, params] = useRoute("/category/:slug");
  const slug = params?.slug;

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: [`/api/categories/${slug}`],
    enabled: !!slug
  });

  const { data: tools, isLoading: toolsLoading } = useQuery({
    queryKey: [`/api/categories/${slug}/tools`],
    enabled: !!slug
  });

  useEffect(() => {
    if (category) {
      document.title = `${category.name} Tools | ToolFinder`;
    }
  }, [category]);

  // Dynamic icon rendering from lucide-react
  const getLucideIcon = (iconName: string, className: string) => {
    if (!iconName) return null;
    const IconComponent = (Lucide as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, x => x[1].toUpperCase())];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  // Map color strings to Tailwind classes
  const colorMap: Record<string, string> = {
    primary: "text-primary-500",
    secondary: "text-secondary-500",
    green: "text-green-500",
    purple: "text-purple-500",
    blue: "text-blue-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
    indigo: "text-indigo-500",
  };

  const iconColor = category ? colorMap[category.color] || "text-gray-500" : "text-gray-500";

  if (!match) {
    return null;
  }

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {categoryLoading ? (
          <div className="animate-pulse py-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-16"></div>
          </div>
        ) : (
          <section className="mb-16">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
                {category && getLucideIcon(category.iconName, `h-8 w-8 mr-3 ${iconColor}`)}
                {category?.name} Tools
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {category?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolsLoading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                ))
              ) : tools?.length ? (
                tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} showCategory={false} />
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No tools found in this category.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </>
  );
}
