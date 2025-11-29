import React, { useState } from 'react';
import { Search, MapPin } from "lucide-react";
import { toast } from 'sonner';

export default function HeroSection() {
  const [practiceArea, setPracticeArea] = useState('');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const mockLawyers = [
    { id: 1, name: 'John Smith', practice: 'Personal Injury', location: 'New York, NY', rating: 4.8, experience: '15 years' },
    { id: 2, name: 'Sarah Johnson', practice: 'Family Law', location: 'Los Angeles, CA', rating: 4.9, experience: '12 years' },
    { id: 3, name: 'Michael Brown', practice: 'Criminal Defense', location: 'Chicago, IL', rating: 4.7, experience: '18 years' },
    { id: 4, name: 'Emily Davis', practice: 'Corporate Law', location: 'Houston, TX', rating: 4.6, experience: '10 years' },
    { id: 5, name: 'David Wilson', practice: 'Real Estate', location: 'Miami, FL', rating: 4.8, experience: '14 years' },
    { id: 6, name: 'Lisa Anderson', practice: 'Immigration', location: 'Seattle, WA', rating: 4.9, experience: '16 years' }
  ];

  const handleSearch = () => {
    if (!practiceArea.trim() && !location.trim()) {
      toast.error('Please enter a practice area or location to search');
      return;
    }

    let filtered = mockLawyers;

    if (practiceArea.trim()) {
      filtered = filtered.filter(lawyer => 
        lawyer.practice.toLowerCase().includes(practiceArea.toLowerCase()) ||
        lawyer.name.toLowerCase().includes(practiceArea.toLowerCase())
      );
    }

    if (location.trim()) {
      filtered = filtered.filter(lawyer => 
        lawyer.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setSearchResults(filtered);
    
    if (filtered.length > 0) {
      toast.success(`Found ${filtered.length} lawyer(s) matching your search`);
    } else {
      toast.error('No lawyers found matching your criteria');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-lawyer-gray px-4 sm:px-6 md:px-12 lg:px-[244px] pt-12 md:pt-16 lg:pt-20 pb-8 md:pb-12 lg:pb-[92px] relative overflow-hidden">
      {/* SEO-friendly background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&h=1080&fit=crop&crop=center&auto=format&q=80" 
          alt="Professional lawyers and attorneys in modern law office - Legal consultation and representation services"
          className="w-full h-full object-cover opacity-15"
          loading="eager"
          fetchpriority="high"
        />
      </div>
      <div className="relative z-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-6 lg:gap-[23px]">
          <h1 className="text-lawyer-blue font-inter text-3xl sm:text-4xl lg:text-[45px] font-bold leading-tight lg:leading-[52px]">
            Find Qualified Lawyers &
            <br />
            Legal Professionals Near You
          </h1>
          <p className="text-lawyer-gray-text font-inter text-lg md:text-xl leading-relaxed max-w-2xl">
            Connect with experienced attorneys specializing in your legal needs. Search by practice area, location, and get expert legal representation today.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-[104px]">
            <div className="text-lawyer-gray-text font-inter text-base md:text-[19px] font-normal leading-[26px]">
              Find a lawyer
            </div>
            <div className="flex items-center justify-center gap-2.5 border-b-4 border-[#0071BC] pb-2.5">
              <div className="text-lawyer-gray-text font-lato text-base md:text-[19px] font-bold leading-[26px]">
                Get Started
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-6">
          <div className="relative flex-1 max-w-full sm:max-w-[354px]">
            <div className="absolute left-0 top-0 h-[38px] w-[38px] flex items-center justify-center pointer-events-none">
              <Search className="w-4 h-4 text-lawyer-gray-dark" />
            </div>
            <input
              type="text"
              placeholder="Practice area or lawyer name"
              value={practiceArea}
              onChange={(e) => setPracticeArea(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Search by practice area or lawyer name"
              className="w-full h-[38px] pl-[34px] pr-3 py-2.5 border border-[#CCC] bg-white text-base font-inter placeholder:text-lawyer-gray-text placeholder:opacity-40"
            />
          </div>

          <div className="relative flex-1 max-w-full sm:max-w-[232px]">
            <div className="absolute left-0 top-0 h-[38px] w-[38px] flex items-center justify-center pointer-events-none">
              <MapPin className="w-4 h-4 text-lawyer-gray-dark" />
            </div>
            <input
              type="text"
              placeholder="City, state, or ZIP code"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Search by city, state, or ZIP code"
              className="w-full h-[38px] pl-[34px] pr-3 py-2.5 border border-[#CCC] bg-white text-base font-inter placeholder:text-lawyer-gray-text placeholder:opacity-40"
            />
          </div>

          <button 
            onClick={handleSearch}
            className="h-[38px] px-6 bg-gradient-to-b from-[#0071BC] to-[#00D2FF] text-white font-inter text-sm font-normal leading-[22.5px] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Found {searchResults.length} lawyer(s)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {searchResults.map((lawyer) => (
                <div 
                  key={lawyer.id} 
                  onClick={() => window.open(`/lawyer/${lawyer.id}`, '_blank')}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer p-3"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{lawyer.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{lawyer.name}</h4>
                      <p className="text-blue-600 text-xs">{lawyer.practice}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{lawyer.location}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700 ml-1">{lawyer.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}