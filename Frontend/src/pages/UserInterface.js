import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

/**
 * Sub-components (Icons & Logo)
 */

function LegalCityLogo() {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
        <span className="text-[#0284C7] font-bold text-lg tracking-tight">Legal</span>
      </div>
      <span className="text-white font-bold text-lg tracking-tight">City</span>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
      <path d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z" fill="#FDCF00"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="flex-shrink-0 mt-[2px]">
      <path d="M4 0C1.78857 0 0 1.878 0 4.2C0 7.35 4 12 4 12C4 12 8 7.35 8 4.2C8 1.878 6.21143 0 4 0ZM4 5.7C3.21143 5.7 2.57143 5.028 2.57143 4.2C2.57143 3.372 3.21143 2.7 4 2.7C4.78857 2.7 5.42857 3.372 5.42857 4.2C5.42857 5.028 4.78857 5.7 4 5.7Z" fill="#5A5A5A"/>
    </svg>
  );
}

/**
 * Layout Components
 */

function Header({ currentLanguage, setCurrentLanguage, translations }) {
  const navigate = useNavigate();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showDirectoryMenu, setShowDirectoryMenu] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' }
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleLanguageSelect = (language) => {
    setCurrentLanguage(language.code);
    setShowLanguageMenu(false);
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#0071BC] to-[#00D2FF] flex items-center h-16" style={{ height: 64 }}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 lg:px-[144px]">
        <div className="flex items-center gap-6">
          <LegalCityLogo />
          <div className="relative">
            <button 
              onClick={() => setShowDirectoryMenu(!showDirectoryMenu)}
              className="hidden md:flex items-center text-white text-sm gap-2 hover:opacity-90 transition-opacity"
            >
              <span>{translations[currentLanguage].lawyerDirectory}</span>
              <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.491211 0.34375L3.99121 5.34375L7.49121 0.34375" stroke="white" strokeWidth="1.2"/>
              </svg>
            </button>
            
            {showDirectoryMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10 min-w-[160px]">
                <button
                  onClick={() => {
                    navigate('/lawyers');
                    setShowDirectoryMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
                >
                  Directory
                </button>
                <button
                  onClick={() => {
                    navigate('/');
                    setShowDirectoryMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-b-lg"
                >
                  Find Lawyer
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleLoginClick}
            className="flex items-center gap-2 h-[38px] px-4 rounded-[20px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="4" r="3" stroke="white" strokeWidth="1.5"/>
              <path d="M2 12c0-2.5 2.5-4 5-4s5 1.5 5 4" stroke="white" strokeWidth="1.5"/>
            </svg>
            <span className="text-white text-sm">{translations[currentLanguage].login}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 h-[38px] px-3 rounded-[20px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5"/>
                <path d="M2 8h12M8 2c1.5 0 3 2.5 3 6s-1.5 6-3 6-3-2.5-3-6 1.5-6 3-6z" stroke="white" strokeWidth="1.5"/>
              </svg>
              <span className="text-white text-sm">{currentLanguage}</span>
              <svg className={`w-3 h-3 text-white transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10 min-w-[120px]">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSignupClick}
            className="h-[38px] px-6 rounded-[20px] bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
          >
{translations[currentLanguage].signup}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ currentLanguage, translations }) {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    lawyer: '',
    specialty: '',
    location: ''
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchData.lawyer) queryParams.append('lawyer', searchData.lawyer);
    if (searchData.specialty) queryParams.append('specialty', searchData.specialty);
    if (searchData.location) queryParams.append('location', searchData.location);
    
    navigate(`/lawyers?${queryParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative w-full h-[500px] sm:h-[600px] bg-gray-900">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/d12735386b9fab735739b6b5424336fcff2f69c9?width=2880"
        alt="Lawyer and client shaking hands"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(90,90,90,0.20)]" />

      <div className="relative h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[400px]">
          <h1 className="text-white text-xl sm:text-2xl font-semibold mb-6 sm:mb-[30px]">
            {translations[currentLanguage].findLawyer}
          </h1>

          <div className="flex flex-col gap-4 sm:gap-[24px]">
            <div className="h-[41px] rounded-[8px] border border-white/20 bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-md px-4 flex items-center">
              <input
                type="text"
                placeholder={translations[currentLanguage].practiceNameLawyer}
                value={searchData.lawyer}
                onChange={(e) => handleInputChange('lawyer', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent placeholder-[#F5F5F5] text-[#F5F5F5] text-sm focus:outline-none"
              />
            </div>

            <div className="h-[41px] rounded-[8px] border border-white/20 bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-md px-4 flex items-center">
              <input
                type="text"
                placeholder={translations[currentLanguage].specialty}
                value={searchData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent placeholder-[#F5F5F5] text-[#F5F5F5] text-sm focus:outline-none"
              />
            </div>

            <div className="h-[41px] rounded-[8px] border border-white/20 bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-md px-4 flex items-center">
              <input
                type="text"
                placeholder={translations[currentLanguage].cityStateZip}
                value={searchData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent placeholder-[#F5F5F5] text-[#F5F5F5] text-sm focus:outline-none"
              />
            </div>

            <button
              onClick={handleSearch}
              className="h-[41px] rounded-[8px] bg-gradient-to-r from-[#0071BC] to-[#00D2FF] text-white font-medium hover:opacity-90 transition-opacity"
            >
{translations[currentLanguage].searchLawyers}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LawyerCard({
  category,
  name,
  rating,
  location,
  image,
  practiceAreas,
  successTitle,
  successAuthor,
  successDate,
  successDescription,
  id = 1,
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-[380px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="flex flex-col h-[520px]">
        {/* Header with Category */}
        <div className="px-6 pt-6 pb-3">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#0071BC] to-[#00D2FF] text-white text-sm font-medium rounded-full">
            {category}
          </span>
        </div>

        {/* Lawyer Info Section */}
        <div className="px-6 pb-4">
          <div className="flex gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={image}
                alt={name}
                className="w-16 h-16 object-cover rounded-full border-3 border-gray-200 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white">
                <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-1"></div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                {name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {rating.toFixed(1)}
                </span>
              </div>

              <div className="flex items-start gap-1 text-gray-600">
                <LocationIcon />
                <span className="text-xs leading-tight">{location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Areas */}
        <div className="px-6 py-3 bg-gray-50 border-y border-gray-100">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Practice Areas</h4>
          <div className="flex flex-wrap gap-1">
            {practiceAreas.split(', ').slice(0, 3).map((area, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Success Story - Flexible Height */}
        <div className="px-6 py-4 flex-1 flex flex-col">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">{successTitle}</h4>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {successAuthor} • {successDate}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed flex-1 overflow-hidden">
            {successDescription.length > 120 ? successDescription.substring(0, 120) + '...' : successDescription}
          </p>
        </div>

        {/* View Profile Button - Fixed at Bottom */}
        <div className="px-6 pb-6 mt-auto">
          <button 
            onClick={() => navigate(`/lawyer/${id}`)}
            className="w-full py-3 bg-gradient-to-r from-[#0071BC] to-[#00D2FF] text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function LawyerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  const lawyers = [
    {
      id: 1,
      category: "Corporate Law",
      name: "Nedime Acikli",
      rating: 4.9,
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      practiceAreas: "Corporate Law, Business Litigation, Contract Law",
      successTitle: "Recent Success",
      successAuthor: "Client Review",
      successDate: "Oct 2024",
      successDescription: "Exceptional legal expertise in corporate matters. Nedime provided strategic guidance that saved our company significant costs and resolved complex contract disputes efficiently.",
    },
    {
      id: 2,
      category: "Family Law",
      name: "Melek Arican",
      rating: 4.8,
      location: "Birmingham, UK",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      practiceAreas: "Family Law, Divorce, Child Custody",
      successTitle: "Client Testimonial",
      successAuthor: "Verified Client",
      successDate: "Sep 2024",
      successDescription: "Compassionate and professional approach to family law matters. Melek guided us through a difficult divorce process with empathy and achieved the best possible outcome for our children.",
    },
    {
      id: 3,
      category: "Criminal Defense",
      name: "Nika Monhart",
      rating: 4.9,
      location: "Manchester, UK",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      practiceAreas: "Criminal Defense, White Collar Crime, Appeals",
      successTitle: "Case Victory",
      successAuthor: "Court Record",
      successDate: "Nov 2024",
      successDescription: "Outstanding criminal defense representation. Nika's thorough preparation and courtroom expertise resulted in a complete dismissal of charges in a complex white-collar case.",
    },
    {
      id: 4,
      category: "Personal Injury",
      name: "Ronald Richards",
      rating: 4.7,
      location: "Leeds, UK",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      practiceAreas: "Personal Injury, Medical Malpractice, Insurance Claims",
      successTitle: "Settlement Success",
      successAuthor: "Client Feedback",
      successDate: "Oct 2024",
      successDescription: "Secured substantial compensation for personal injury case. Ronald's dedication and negotiation skills resulted in a settlement that exceeded our expectations and covered all medical expenses.",
    },
    {
      id: 5,
      category: "Real Estate Law",
      name: "Darlene Robertson",
      rating: 4.8,
      location: "Bristol, UK",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      practiceAreas: "Real Estate, Property Law, Commercial Leasing",
      successTitle: "Property Deal",
      successAuthor: "Business Client",
      successDate: "Dec 2024",
      successDescription: "Expert handling of complex commercial property transactions. Darlene's attention to detail and market knowledge ensured smooth closings and protected our investment interests.",
    },
  ];

  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  const totalSlides = Math.ceil(lawyers.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 relative">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Legal Professionals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Connect with top-rated lawyers in your area. Our verified professionals are ready to help with your legal needs.</p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="min-w-full flex justify-center items-stretch gap-6">
                  {lawyers.slice(slideIndex * cardsPerSlide, slideIndex * cardsPerSlide + cardsPerSlide).map((lawyer, index) => (
                    <LawyerCard key={index} {...lawyer} />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group border border-gray-200"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
              <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group border border-gray-200"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-0.5 transition-transform">
              <path d="M9 18L15 12L9 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? "bg-gradient-to-r from-[#0071BC] to-[#00D2FF] scale-110" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Footer Component
 */

function Footer({ currentLanguage, translations }) {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
                <span className="text-[#0284C7] font-bold text-lg tracking-tight">Legal</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">City</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connect with qualified legal professionals in your area. Find the right lawyer for your specific legal needs with our comprehensive directory.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/lawyers')} className="text-gray-300 hover:text-white transition-colors">Find Lawyers</button></li>
              <li><button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition-colors">Login</button></li>
              <li><button onClick={() => navigate('/register')} className="text-gray-300 hover:text-white transition-colors">Sign Up</button></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal Areas</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Corporate Law</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Family Law</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Criminal Defense</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Personal Injury</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 LegalCity. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Main Page Component
 */

export default function UserInterface() {
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  const translations = {
    EN: {
      findLawyer: 'Find Lawyer',
      practiceNameLawyer: 'Practice name / Lawyer',
      specialty: 'Specialty',
      cityStateZip: 'City, State or Zip',
      searchLawyers: 'Search Lawyers',
      topFeaturesLawyers: 'Top Features lawyers near you'
    },
    ES: {
      findLawyer: 'Encontrar Abogado',
      practiceNameLawyer: 'Nombre del bufete / Abogado',
      specialty: 'Especialidad',
      cityStateZip: 'Ciudad, Estado o Código Postal',
      searchLawyers: 'Buscar Abogados',
      topFeaturesLawyers: 'Los mejores abogados cerca de ti'
    },
    FR: {
      findLawyer: 'Trouver un Avocat',
      practiceNameLawyer: 'Nom du cabinet / Avocat',
      specialty: 'Spécialité',
      cityStateZip: 'Ville, État ou Code Postal',
      searchLawyers: 'Rechercher des Avocats',
      topFeaturesLawyers: 'Les meilleurs avocats près de chez vous'
    },
    DE: {
      findLawyer: 'Anwalt Finden',
      practiceNameLawyer: 'Kanzleiname / Anwalt',
      specialty: 'Fachgebiet',
      cityStateZip: 'Stadt, Bundesland oder PLZ',
      searchLawyers: 'Anwälte Suchen',
      topFeaturesLawyers: 'Top Anwälte in Ihrer Nähe'
    }
  };

  return (
    <>
      <HeroSection currentLanguage={currentLanguage} translations={translations} />
      <LawyerCarousel />
    </>
  );
}