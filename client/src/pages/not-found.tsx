import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Search, MapPin, Compass, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <Header />
      
      <main className="min-h-[70vh] w-full flex flex-col items-center justify-center py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-red-100 text-red-600">
            <Compass className="h-10 w-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-red-600">
            404 - Page Not Found
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            We can't seem to find the page you're looking for. Let's help you find your way back.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2 px-6 py-6"
              onClick={() => window.location.href = '/'}
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
            
            <Button 
              variant="outline" 
              className="border-primary-200 flex items-center gap-2 px-6 py-6"
              onClick={() => window.location.href = '/category/all'}
            >
              <MapPin className="h-5 w-5 text-primary-500" />
              View All Categories
            </Button>
          </div>
          
          <div className="mt-16 p-6 rounded-xl bg-gray-50 border border-gray-100">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-primary-500" />
              Looking for something specific?
            </h3>
            <p className="text-gray-600">
              Check our categories or try searching for the tool you need. We have a wide collection of free online tools to help you with your tasks.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
