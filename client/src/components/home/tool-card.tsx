import * as Lucide from "lucide-react";
import { Tool } from "@shared/schema";
import { SiCanva, SiFigma, SiAdobe, SiGoogle, SiNotion, SiTrello, SiGithub, SiWordpress, SiWix, SiGrammarly } from "react-icons/si";
import { FaTools, FaExternalLinkAlt, FaStar, FaMicrosoft } from "react-icons/fa";

interface ToolCardProps {
  tool: Tool & { 
    category?: { 
      name: string; 
      color: string; 
    };
    id: number;
    name: string;
    description: string;
    url: string;
    iconName?: string;
    iconUrl?: string;
    popular?: boolean;
    isNew?: boolean;
  };
  showCategory?: boolean;
  isNew?: boolean;
}

// Map color strings to Tailwind classes for badges
const badgeColorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary-100", text: "text-primary-700" },
  secondary: { bg: "bg-secondary-100", text: "text-secondary-700" },
  green: { bg: "bg-green-100", text: "text-green-700" },
  purple: { bg: "bg-purple-100", text: "text-purple-700" },
  blue: { bg: "bg-blue-100", text: "text-blue-700" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-700" },
  red: { bg: "bg-red-100", text: "text-red-700" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-700" },
  sky: { bg: "bg-sky-100", text: "text-sky-700" },
  teal: { bg: "bg-teal-100", text: "text-teal-700" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700" },
  rose: { bg: "bg-rose-100", text: "text-rose-700" },
  amber: { bg: "bg-amber-100", text: "text-amber-700" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-700" },
};

// Map color strings to Tailwind classes for icons
const iconColorMap: Record<string, { bg: string; text: string; gradient: string; border: string }> = {
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

export function ToolCard({ tool, showCategory = true, isNew = false }: ToolCardProps) {
  // Get icon for the tool - either custom uploaded or predefined
  const getToolIcon = () => {
    // If there's a custom uploaded icon URL, use an image tag
    if (tool.iconUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img 
            src={tool.iconUrl} 
            alt={`${tool.name} icon`} 
            className="w-5 h-5 object-contain"
          />
        </div>
      );
    }
    
    // Otherwise use predefined icon
    return getBrandIcon(tool.name, tool.iconName || 'wrench', "h-5 w-5");
  };

  // Brand icons mapping for popular tools
  const getBrandIcon = (name: string, iconName: string, className: string) => {
    // Map for brands with direct icon matches
    const brandMap: Record<string, React.ReactNode> = {
      'canva': <SiCanva className={className} />,
      'figma': <SiFigma className={className} />,
      'adobe': <SiAdobe className={className} />,
      'google': <SiGoogle className={className} />,
      'microsoft': <FaMicrosoft className={className} />,
      'notion': <SiNotion className={className} />,
      'trello': <SiTrello className={className} />,
      'github': <SiGithub className={className} />,
      'wordpress': <SiWordpress className={className} />,
      'wix': <SiWix className={className} />,
      'grammarly': <SiGrammarly className={className} />
    };
    
    // Check if we have a direct match by tool name (case-insensitive)
    const normalizedName = name.toLowerCase();
    for (const [brand, icon] of Object.entries(brandMap)) {
      if (normalizedName.includes(brand)) {
        return icon;
      }
    }
    
    // If no direct match, try the Lucide icon
    // Format the icon name to match Lucide component naming (PascalCase)
    if (iconName) {
      const formattedIconName = iconName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      
      // Get the icon component from Lucide
      const IconComponent = (Lucide as any)[formattedIconName];
      
      // If the icon exists in Lucide, return it
      if (IconComponent) {
        return <IconComponent className={className} />;
      }
    }
    
    // Fallback icons based on category
    if (tool.category) {
      const categoryIcons: Record<string, string> = {
        'Design': 'Paintbrush',
        'Productivity': 'Clock',
        'Development': 'Code',
        'Writing': 'PenTool',
        'Marketing': 'BarChart',
        'SEO': 'Search',
        'Finance': 'DollarSign',
        'Communication': 'MessageCircle'
      };
      
      const fallbackIconName = categoryIcons[tool.category.name] || 'Tool';
      const FallbackIcon = (Lucide as any)[fallbackIconName];
      
      if (FallbackIcon) {
        return <FallbackIcon className={className} />;
      }
    }
    
    // Final default fallback
    return <Lucide.Wrench className={className} />;
  };

  const color = tool.category?.color || "primary";
  const iconColor = iconColorMap[color] || { bg: "bg-gray-100", text: "text-gray-600" };
  const badgeColor = badgeColorMap[color] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <a 
      href={tool.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="tool-card bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary-200 overflow-hidden relative hover:-translate-y-1"
    >
      {(isNew || tool.isNew) && (
        <div className="absolute top-3 right-3">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-medium rounded-full shadow-sm border border-green-200">
            New
          </span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${iconColor.gradient} ${iconColor.text} rounded-lg flex items-center justify-center mr-4 shadow-sm border ${iconColor.border}`}>
            {getToolIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{tool.name}</h3>
            {showCategory && tool.category && (
              <span className={`text-xs px-2 py-0.5 ${badgeColor.bg} ${badgeColor.text} rounded-full border ${iconColor.border}`}>
                {tool.category.name}
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed font-medium">
          {tool.description}
        </p>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
          <span className="text-primary-600 font-medium flex items-center">
            <Lucide.ExternalLink className="h-3.5 w-3.5 mr-1" /> Visit website
          </span>
          {tool.popular && (
            <span className="text-amber-600 flex items-center font-medium">
              <Lucide.Star className="h-3.5 w-3.5 mr-1" /> Popular
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
