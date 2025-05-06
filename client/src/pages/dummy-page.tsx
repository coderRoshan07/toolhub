import { useParams } from 'wouter';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BackToTop } from '@/components/ui/back-to-top';

export default function DummyPage() {
  const params = useParams();
  const pageId = params.pageId;
  
  const getPageTitle = () => {
    switch (pageId) {
      case 'resources': return 'Resources';
      case 'blog': return 'Blog';
      case 'suggest-tool': return 'Suggest a Tool';
      case 'newsletter': return 'Newsletter';
      case 'about': return 'About Us';
      case 'legal': return 'Legal Information';
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'cookies': return 'Cookie Policy';
      case 'contact': return 'Contact Us';
      default: return 'Page';
    }
  };

  const getPageDescription = () => {
    switch (pageId) {
      case 'resources': return 'Helpful resources and guides for using online tools effectively.';
      case 'blog': return 'Latest news, tool reviews, and tips from our team.';
      case 'suggest-tool': return 'Help us grow our collection by suggesting your favorite tools.';
      case 'newsletter': return 'Subscribe to our newsletter for the latest updates on free online tools.';
      case 'about': return 'Learn more about ToolFinder and our mission.';
      case 'legal': return 'Important legal information regarding the use of our website.';
      case 'privacy': return 'How we collect, use, and protect your personal information.';
      case 'terms': return 'Terms and conditions for using ToolFinder.';
      case 'cookies': return 'Information about how we use cookies on our website.';
      case 'contact': return 'Get in touch with the ToolFinder team.';
      default: return 'This page is currently under construction.';
    }
  };

  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{getPageTitle()}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">{getPageDescription()}</p>
            
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-100 mb-8">
              <h2 className="text-xl font-semibold text-primary-900 mb-2">🚧 Under Construction</h2>
              <p className="text-primary-700">
                We're currently working on this page. Content will be added soon. Please check back later!
              </p>
            </div>
            
            <h2 className="text-xl font-semibold mb-3">What to expect</h2>
            <p>
              When this page is complete, you'll find detailed information about {getPageTitle().toLowerCase()}. 
              Our team is working to ensure this content is helpful, accurate, and comprehensive.
            </p>
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Feedback</h2>
            <p>
              Have suggestions for what you'd like to see on this page? 
              We'd love to hear your thoughts! Contact us using the information on our Contact page.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to previous page
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
      <BackToTop />
    </>
  );
}
