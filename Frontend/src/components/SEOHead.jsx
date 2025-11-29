import { useEffect } from 'react';
import { updatePageMeta, addStructuredData } from '../utils/seo';

const SEOHead = ({ 
  title, 
  description, 
  keywords = '', 
  canonical = '', 
  image = '', 
  type = 'website',
  structuredData = null 
}) => {
  useEffect(() => {
    // Update meta tags
    updatePageMeta(title, description, keywords, canonical, image, type);
    
    // Add structured data if provided
    if (structuredData) {
      addStructuredData(structuredData);
    }
  }, [title, description, keywords, canonical, image, type, structuredData]);

  return null; // This component doesn't render anything
};

export default SEOHead;