import { Link } from "wouter";
import { Drill, Twitter, Facebook, Linkedin, Github, ArrowRight, Mail, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Footer() {
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories']
  });
  
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Top Section with Newsletter */}
      <div className="container mx-auto px-4 py-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-6 flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Stay updated with new tools</h3>
              <p className="text-gray-600">Get notified when we add new tools to our collection.</p>
            </div>
            
            <div className="w-full md:w-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 min-w-0 px-4 py-2 text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button 
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md flex items-center transition-colors duration-150"
                >
                  Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-1.5 rounded-lg shadow-sm mr-2">
                <Drill className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-700">Tool</span>
                <span>Finder</span>
              </h2>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed font-medium">
              Your one-stop directory for discovering the best free online tools across various categories.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 hover:text-primary-600 transition-colors duration-150">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 hover:text-primary-600 transition-colors duration-150">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 hover:text-primary-600 transition-colors duration-150">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 hover:text-primary-600 transition-colors duration-150">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:contact@toolfinder.com" className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-600 hover:text-primary-600 transition-colors duration-150">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-4 w-4 text-primary-500 mr-2" />
              Popular Categories
            </h3>
            <ul className="space-y-2">
              {categories?.slice(0, 5).map((category: any) => (
                <li key={category.id}>
                  <div 
                    className="text-gray-700 hover:text-primary-600 hover:underline transition-colors inline-block cursor-pointer font-medium"
                    onClick={() => window.location.href = `/category/${category.slug}`}
                  >
                    {category.name}
                  </div>
                  {category.toolCount && (
                    <span className="text-xs text-gray-600 ml-2">({category.toolCount})</span>
                  )}
                </li>
              ))}
              <li>
                <div 
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center mt-2 cursor-pointer"
                  onClick={() => window.location.href = '/category/all'}
                >
                  View all categories <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <div 
                  className="text-gray-700 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium"
                  onClick={() => window.location.href = '/page/resources'}
                >
                  Resources
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-700 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium"
                  onClick={() => window.location.href = '/page/blog'}
                >
                  Blog
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-700 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium"
                  onClick={() => window.location.href = '/page/suggest-tool'}
                >
                  Suggest a Tool
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-700 hover:text-primary-600 hover:underline transition-colors cursor-pointer font-medium"
                  onClick={() => window.location.href = '/page/newsletter'}
                >
                  Newsletter
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-600 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                  onClick={() => window.location.href = '/page/about'}
                >
                  About Us
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <div 
                  className="text-gray-600 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                  onClick={() => window.location.href = '/page/legal'}
                >
                  Legal Information
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-600 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                  onClick={() => window.location.href = '/page/privacy'}
                >
                  Privacy Policy
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-600 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                  onClick={() => window.location.href = '/page/terms'}
                >
                  Terms of Service
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-600 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                  onClick={() => window.location.href = '/page/cookies'}
                >
                  Cookie Policy
                </div>
              </li>
              <li>
                <div 
                  className="text-gray-600 hover:text-primary-600 hover:underline transition-colors cursor-pointer"
                  onClick={() => window.location.href = '/page/contact'}
                >
                  Contact
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
          <p className="font-medium">&copy; {new Date().getFullYear()} ToolFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
