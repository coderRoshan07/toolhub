import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button when user scrolls down 300px
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <div 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-primary-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-primary-700 transition-all duration-300 animate-fade-in"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </div>
      )}
    </>
  );
}
