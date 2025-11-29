import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import DashboardHeader from '../components/layout/DashboardHeader';
import HeroSection from "../components/HeroSection";
import LawyersCarousel from "../components/LawyersCarousel";
import BrowseLawyers from "../components/BrowseLawyers";

export default function FindLawyer() {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if user came from dashboard
  const cameFromDashboard = user && location.pathname === '/dashboard/find-lawyer';

  // SEO optimization
  useEffect(() => {
    document.title = 'Find a Lawyer Near You - Search Qualified Attorneys by Practice Area | LegalCity';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Find experienced lawyers and attorneys near you. Search by practice area, location, and specialization. Connect with qualified legal professionals for your legal needs.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }
    
    // Add keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    metaKeywords.setAttribute('content', 'find lawyer, search attorneys, legal help, lawyer near me, attorney search, legal services, qualified lawyers');
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }

    // Add structured data for better SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Find a Lawyer",
      "description": "Search and find qualified lawyers and attorneys by practice area and location",
      "url": "https://legalcity.com/find-a-lawyer",
      "mainEntity": {
        "@type": "SearchAction",
        "target": "https://legalcity.com/find-a-lawyer?q={search_term}",
        "query-input": "required name=search_term"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="min-h-screen">
      {cameFromDashboard && <DashboardHeader />}
      <HeroSection />
      <LawyersCarousel />
      <BrowseLawyers />
    </div>
  );
}