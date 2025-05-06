import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function CTASection() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    categoryId: '',
    submitterEmail: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      categoryId: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      // Basic validation
      if (!formData.name.trim() || !formData.description.trim() || !formData.url.trim() || !formData.categoryId) {
        toast({
          title: "Missing information",
          description: "Please fill out all required fields.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // URL validation
      try {
        new URL(formData.url);
      } catch (e) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL (e.g., https://example.com).",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Email validation (simple regex)
      if (formData.submitterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.submitterEmail)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Send to API
      await apiRequest(
        'POST',
        '/api/suggestions',
        { 
          ...formData,
          categoryId: parseInt(formData.categoryId)
        }
      );

      // Reset form and show success message
      setFormData({
        name: '',
        description: '',
        url: '',
        categoryId: '',
        submitterEmail: '',
      });

      toast({
        title: "Tool suggestion submitted!",
        description: "Thank you for your contribution. We'll review it soon.",
      });

      setOpen(false);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your suggestion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-primary-700 text-white py-16 mb-20 relative overflow-hidden">
      {/* Dark background overlay for better text visibility */}
      <div className="absolute inset-0 bg-primary-800 opacity-70"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-primary-300 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto bg-white py-10 px-6 rounded-xl shadow-lg border border-gray-200">
          <div className="inline-block bg-white rounded-2xl px-6 py-2 mb-6 text-black text-base font-bold shadow-md border-2 border-black">💡 Share Your Discoveries</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Missing a tool you love?
          </h2>
          <p className="text-lg text-gray-800 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            We're constantly expanding our collection. Help us grow by suggesting your favorite free tools that might be useful to others.
          </p>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                size="lg"
                className="bg-black text-white hover:bg-gray-800 transition-all duration-300 border-2 border-black shadow-md hover:shadow-lg font-bold px-8 py-6 rounded-lg text-lg"
              >
                Suggest a Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Suggest a Tool</DialogTitle>
                <DialogDescription className="text-gray-700 font-medium">
                  Share your favorite free online tools with our community.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Tool Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="E.g., Figma, Canva, etc." 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-medium">Description <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="What does this tool do?" 
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url" className="font-medium">Website URL <span className="text-red-500">*</span></Label>
                  <Input 
                    id="url" 
                    name="url" 
                    type="url" 
                    placeholder="https://..." 
                    value={formData.url}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-medium">Category <span className="text-red-500">*</span></Label>
                  <Select 
                    value={formData.categoryId} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Your Email (optional)</Label>
                  <Input 
                    id="email" 
                    name="submitterEmail" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={formData.submitterEmail}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500">We'll let you know if your suggestion is added.</p>
                </div>
                
                <DialogFooter className="mt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold border-2 border-black transition-all duration-300"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
