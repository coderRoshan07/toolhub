import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import * as Lucide from "lucide-react";

interface CategoryGridProps {
  title?: string;
}

// Map color strings to Tailwind classes
const colorMap: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
  primary: { 
    bg: "bg-primary-100", 
    text: "text-primary-600",
    gradient: "from-primary-50 to-primary-100",
    border: "border-primary-200"
  },
  secondary: { 
    bg: "bg-secondary-100", 
    text: "text-secondary-600",
    gradient: "from-secondary-50 to-secondary-100",
    border: "border-secondary-200"
  },
  green: { 
    bg: "bg-green-100", 
    text: "text-green-600",
    gradient: "from-green-50 to-green-100",
    border: "border-green-200"
  },
  purple: { 
    bg: "bg-purple-100", 
    text: "text-purple-600",
    gradient: "from-purple-50 to-purple-100",
    border: "border-purple-200"
  },
  blue: { 
    bg: "bg-blue-100", 
    text: "text-blue-600",
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-200"
  },
  yellow: { 
    bg: "bg-yellow-100", 
    text: "text-yellow-600",
    gradient: "from-yellow-50 to-yellow-100",
    border: "border-yellow-200"
  },
  red: { 
    bg: "bg-red-100", 
    text: "text-red-600",
    gradient: "from-red-50 to-red-100",
    border: "border-red-200"
  },
  indigo: { 
    bg: "bg-indigo-100", 
    text: "text-indigo-600",
    gradient: "from-indigo-50 to-indigo-100",
    border: "border-indigo-200"
  },
  sky: { 
    bg: "bg-sky-100", 
    text: "text-sky-600",
    gradient: "from-sky-50 to-sky-100",
    border: "border-sky-200"
  },
  teal: { 
    bg: "bg-teal-100", 
    text: "text-teal-600",
    gradient: "from-teal-50 to-teal-100",
    border: "border-teal-200"
  },
  emerald: { 
    bg: "bg-emerald-100", 
    text: "text-emerald-600",
    gradient: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200"
  },
  rose: { 
    bg: "bg-rose-100", 
    text: "text-rose-600",
    gradient: "from-rose-50 to-rose-100",
    border: "border-rose-200"
  },
  amber: { 
    bg: "bg-amber-100", 
    text: "text-amber-600",
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-200"
  },
  cyan: { 
    bg: "bg-cyan-100", 
    text: "text-cyan-600",
    gradient: "from-cyan-50 to-cyan-100",
    border: "border-cyan-200"
  },
};

interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  iconName: string;
  color: string;
  toolCount?: number;
}

export function CategoryGrid({ title = "Popular Categories" }: CategoryGridProps) {
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });
  
  // Dynamic icon rendering from lucide-react
  const getLucideIcon = (iconName: string, className: string) => {
    const IconComponent = (Lucide as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-./g, x => x[1].toUpperCase())];
    return IconComponent ? <IconComponent className={className} /> : null;
  };

  if (isLoading) {
    return (
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-gray-200">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-100 flex flex-col items-center animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <div className="flex items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative">
          {title}
          <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></span>
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories?.map((category) => {
          const colorClass = colorMap[category.color] || { bg: "bg-gray-100", text: "text-gray-600" };
          
          return (
            <div
              key={category.id}
              className="category-card bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-primary-200 flex flex-col items-center cursor-pointer"
              onClick={() => window.location.href = `/category/${category.slug}`}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${colorClass.gradient} ${colorClass.text} rounded-full flex items-center justify-center mb-4 shadow-sm border ${colorClass.border}`}>
                {getLucideIcon(category.iconName, "h-8 w-8")}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">{category.toolCount}</span> tools
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
