import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import * as Lucide from 'lucide-react';
import { SiCanva, SiFigma, SiAdobe, SiGoogle, SiNotion, SiTrello, SiGithub, SiWordpress, SiWix, SiGrammarly } from 'react-icons/si';
import { FaTools, FaExternalLinkAlt, FaStar, FaMicrosoft } from 'react-icons/fa';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/ui/back-to-top';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolCard } from '@/components/home/tool-card';
import { PlusCircle, Search, Settings, Users, Shield, Upload } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tools');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all_categories');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    iconName: 'wrench',
    categoryId: '',
    popular: false,
    isNew: true
  });
  
  // Handle icon upload
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      // Set the selected icon and clear any previously selected predefined icon
      setSelectedIcon(file);
      setFormData(prev => ({ ...prev, iconName: '' }));
    }
  };
  
  // Remove uploaded icon
  const handleRemoveIcon = () => {
    setSelectedIcon(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { toast } = useToast();
  const { user, isAdmin, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Log authentication state for debugging
  useEffect(() => {
    if (!isLoading) {
      console.log('Auth state:', { user, isAdmin });
    }
  }, [user, isAdmin, isLoading]);

  // Fetch all tools
  const { data: tools = [], isLoading: toolsLoading } = useQuery<any[]>({
    queryKey: ['/api/tools'],
  });

  // Fetch all categories for the dropdown
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ['/api/categories'],
  });


  // Filtered tools based on search and category
  const filteredTools = tools.filter(tool => {
    const matchesSearch = search === '' || 
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all_categories' || 
      tool.categoryId === parseInt(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      categoryId: value
    });
  };

  // Add tool mutation
  const addToolMutation = useMutation({
    mutationFn: async (toolData: any) => {
      try {
        if (selectedIcon) {
          // Create FormData object for file upload
          const formData = new FormData();
          
          // Append the icon file
          formData.append('iconFile', selectedIcon);
          
          // Append all other tool data as form fields
          Object.keys(toolData).forEach(key => {
            if (toolData[key] !== undefined) {
              formData.append(key, toolData[key].toString());
            }
          });
          
          // Log that we're submitting with a file
          console.log('Submitting tool with file:', selectedIcon?.name);
          
          // Use fetch directly for FormData
          const response = await fetch('/api/tools', {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'Failed to add tool');
          }
          
          return await response.json();
        } else {
          // Regular JSON request without file
          // Make sure we have a valid iconName
          if (!toolData.iconName || toolData.iconName.trim() === '') {
            toolData.iconName = 'wrench'; // Default icon if none selected
          }
          console.log('Submitting tool without file:', toolData);
          const response = await fetch('/api/tools', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(toolData),
            credentials: 'include'
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'Failed to add tool');
          }
          
          return await response.json();
        }
      } catch (error) {
        console.error('Error in mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Reset form and refresh tools
      setFormData({
        name: '',
        description: '',
        url: '',
        iconName: 'wrench',
        categoryId: '',
        popular: false,
        isNew: true
      });
      // Reset icon upload state
      setSelectedIcon(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowAddForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/tools'] });
      toast({
        title: 'Success!',
        description: 'Tool added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to add tool. Please try again.',
        variant: 'destructive',
      });
      console.error('Error adding tool:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.description || !formData.url || !formData.categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\w\-])+\.([\w\-\.]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
    if (!urlPattern.test(formData.url)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL starting with http:// or https://',
        variant: 'destructive',
      });
      return;
    }
    
    // Add protocol to URL if missing
    let url = formData.url;
    if (!/^https?:\/\//.test(url)) {
      url = 'https://' + url;
    }

    const toolData = {
      ...formData,
      url,
      categoryId: parseInt(formData.categoryId)
    };
    
    console.log('Submitting tool data:', toolData);
    addToolMutation.mutate(toolData);
  };

  // Authentication checks
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </>
    );
  }

  // If not authenticated
  if (!user) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <Shield className="w-16 h-16 mb-4 text-red-500" />
          <h1 className="text-3xl font-bold mb-2">Authentication Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access the admin dashboard.</p>
          <Link href="/auth">
            <Button>Login Now</Button>
          </Link>
        </div>
      </>
    );
  }

  // If not admin
  if (!isAdmin) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <Shield className="w-16 h-16 mb-4 text-red-500" />
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You do not have admin privileges to access this dashboard.</p>
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            Admin Mode
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'tools' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('tools')}
          >
            <Settings className="inline-block mr-2 h-5 w-5" />
            Manage Tools
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'suggestions' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <Users className="inline-block mr-2 h-5 w-5" />
            User Suggestions
          </button>
        </div>
        
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search tools..."
                      className="pl-10"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="w-full md:w-64">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_categories">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={() => setShowAddForm(!showAddForm)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {showAddForm ? 'Cancel' : 'Add Tool'}
                </Button>
              </div>
              
              {/* Add Tool Form */}
              {showAddForm && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4">Add New Tool</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tool Name *</label>
                        <Input 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Figma"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <Select value={formData.categoryId} onValueChange={handleSelectChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
                        <Input 
                          name="url"
                          type="url"
                          value={formData.url}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tool Icon</label>
                        <div className="space-y-4">
                          {/* Icon Upload Section */}
                          <div className="border border-dashed border-gray-300 rounded-lg p-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Upload Company Logo</p>
                            <div className="flex items-start space-x-4">
                              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {selectedIcon ? (
                                  <img 
                                    src={URL.createObjectURL(selectedIcon)}
                                    alt="Selected icon"
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <div className="text-gray-400 flex flex-col items-center">
                                    <Upload className="h-8 w-8 mb-1" />
                                    <span className="text-xs">No file</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <input
                                  type="file"
                                  id="icon-upload"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleIconUpload}
                                  ref={fileInputRef}
                                />
                                <Button 
                                  type="button" 
                                  onClick={() => fileInputRef.current?.click()}
                                  variant="outline"
                                  className="mb-2 w-full justify-start"
                                >
                                  <Upload className="mr-2 h-4 w-4" />
                                  Choose File
                                </Button>
                                <p className="text-xs text-gray-500">
                                  Upload company logo or brand icon (PNG, JPG, SVG). <br />
                                  Max size: 5MB. Square images work best.
                                </p>
                                {selectedIcon && (
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="text-red-500 text-xs mt-1 h-auto p-0"
                                    onClick={handleRemoveIcon}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                            
                          {/* Or Separator */}
                          <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="bg-gray-50 px-4 text-sm text-gray-500">OR</span>
                            </div>
                          </div>
                            
                          {/* Pre-Defined Icons Section */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Choose from Pre-defined Icons</p>
                            <Select 
                              value={!selectedIcon ? formData.iconName : ''} 
                              onValueChange={(value) => {
                                setSelectedIcon(null);
                                setFormData({...formData, iconName: value});
                              }}
                              disabled={!!selectedIcon}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                <div className="py-2 px-2 border-b border-gray-100 mb-2">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Brand Icons</p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <SelectItem value="canva">Canva</SelectItem>
                                    <SelectItem value="figma">Figma</SelectItem>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="microsoft">Microsoft</SelectItem>
                                    <SelectItem value="adobe">Adobe</SelectItem>
                                    <SelectItem value="notion">Notion</SelectItem>
                                    <SelectItem value="trello">Trello</SelectItem>
                                    <SelectItem value="github">GitHub</SelectItem>
                                    <SelectItem value="wordpress">WordPress</SelectItem>
                                    <SelectItem value="wix">Wix</SelectItem>
                                    <SelectItem value="grammarly">Grammarly</SelectItem>
                                  </div>
                                </div>
                                
                                <div className="py-2 px-2">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Generic Icons</p>
                                  <div className="grid grid-cols-2 gap-2">
                                    <SelectItem value="alarm-clock">Alarm Clock</SelectItem>
                                    <SelectItem value="bar-chart">Bar Chart</SelectItem>
                                    <SelectItem value="briefcase">Briefcase</SelectItem>
                                    <SelectItem value="camera">Camera</SelectItem>
                                    <SelectItem value="clock">Clock</SelectItem>
                                    <SelectItem value="code">Code</SelectItem>
                                    <SelectItem value="database">Database</SelectItem>
                                    <SelectItem value="dollar-sign">Dollar Sign</SelectItem>
                                    <SelectItem value="edit">Edit</SelectItem>
                                    <SelectItem value="file">File</SelectItem>
                                    <SelectItem value="globe">Globe</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                    <SelectItem value="layout">Layout</SelectItem>
                                    <SelectItem value="message-circle">Message Circle</SelectItem>
                                    <SelectItem value="tool">Tool</SelectItem>
                                    <SelectItem value="wrench">Wrench</SelectItem>
                                  </div>
                                </div>
                              </SelectContent>
                            </Select>
                            
                            {/* Preview for pre-defined icons */}
                            {!selectedIcon && formData.iconName && (
                              <div className="flex items-center mt-3">
                                <div className="mr-3 bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center">
                                  <div className="text-primary-600">
                                    {(() => {
                                      // Brand icons
                                      const brandIcons = {
                                        canva: <SiCanva className="h-5 w-5" />,
                                        figma: <SiFigma className="h-5 w-5" />,
                                        adobe: <SiAdobe className="h-5 w-5" />,
                                        google: <SiGoogle className="h-5 w-5" />,
                                        microsoft: <FaMicrosoft className="h-5 w-5" />,
                                        notion: <SiNotion className="h-5 w-5" />,
                                        trello: <SiTrello className="h-5 w-5" />,
                                        github: <SiGithub className="h-5 w-5" />,
                                        wordpress: <SiWordpress className="h-5 w-5" />,
                                        wix: <SiWix className="h-5 w-5" />,
                                        grammarly: <SiGrammarly className="h-5 w-5" />
                                      };
                                      
                                      // Check if it's a brand icon
                                      if (formData.iconName in brandIcons) {
                                        return brandIcons[formData.iconName as keyof typeof brandIcons];
                                      }
                                      
                                      // Generic Lucide icons
                                      const formattedIconName = formData.iconName
                                        .split('-')
                                        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                                        .join('');
                                      
                                      const LucideIcon = (Lucide as any)[formattedIconName];
                                      
                                      if (LucideIcon) {
                                        return <LucideIcon className="h-5 w-5" />;
                                      }
                                      
                                      // Fallback
                                      return <Lucide.Wrench className="h-5 w-5" />;
                                    })()}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">Using pre-defined icon: {formData.iconName}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Briefly describe what this tool does"
                          className="w-full min-h-[100px] rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="popular"
                          name="popular"
                          checked={formData.popular}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="popular" className="text-sm font-medium text-gray-700">
                          Mark as Popular
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isNew"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="isNew" className="text-sm font-medium text-gray-700">
                          Mark as New
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={addToolMutation.isPending}>
                        {addToolMutation.isPending ? 'Adding...' : 'Add Tool'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Tools List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'} {search && `matching "${search}"`}
                </h3>
                
                {toolsLoading ? (
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
                      </div>
                    ))}
                  </div>
                ) : filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTools.map((tool) => (
                      <div key={tool.id} className="relative group">
                        <ToolCard tool={tool} showCategory={true} />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary-600">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No tools found. Try adjusting your filters or add a new tool.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'suggestions' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">User Suggestions</h2>
            <p className="text-gray-500 mb-6">
              This section will show user-submitted tool suggestions pending approval.
              <br />
              The API endpoint is implemented but this UI section is still under development.
            </p>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-100">
              <p className="text-primary-700">
                Coming soon: Table view with options to approve, reject, or edit user suggestions.
              </p>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
}
