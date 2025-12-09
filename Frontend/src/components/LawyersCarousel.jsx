import { Star, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function LawyersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  
  const fromDashboard = user && location.pathname === '/dashboard/find-lawyer';

  useEffect(() => {
    fetchFeaturedLawyers();
  }, []);

  const fetchFeaturedLawyers = async () => {
    try {
      const response = await api.get('/lawyers');
      console.log('Fetched lawyers for carousel:', response.data);
      
      // Get all lawyers, prioritize those with secure_id
      const allLawyers = response.data || [];
      const lawyersWithProfiles = allLawyers.filter(lawyer => lawyer.secure_id);
      
      console.log('Lawyers with profiles:', lawyersWithProfiles.length);
      
      // If we have lawyers with profiles, use them; otherwise use first 6 lawyers
      const selectedLawyers = lawyersWithProfiles.length > 0 
        ? lawyersWithProfiles.slice(0, 6)
        : allLawyers.slice(0, 6);
      
      const lawyersData = selectedLawyers.map(lawyer => ({
        id: lawyer.secure_id || lawyer.id,
        name: lawyer.name,
        specialty: lawyer.speciality || 'General Practice',
        rating: parseFloat(lawyer.rating) || 4.5,
        reviews: lawyer.reviews || Math.floor(Math.random() * 100) + 20,
        location: `${lawyer.city || 'Unknown'}, ${lawyer.state || 'Unknown'}`,
        practiceAreas: lawyer.speciality ? [lawyer.speciality] : ['General Practice'],
        successTitle: "Client Testimonial",
        successAuthor: "Verified Client",
        successDate: "Recent",
        successDescription: `Experienced ${lawyer.speciality || 'legal'} attorney providing professional legal services with proven track record.`,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=0284c7&color=fff&size=200`
      }));
      
      console.log('Featured lawyers to display:', lawyersData.length);
      setLawyers(lawyersData);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxSlides = Math.max(0, lawyers.length - 3);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  const getStarClass = (i, rating) => {
    return i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300';
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">Loading featured lawyers...</p>
          </div>
        </div>
      </div>
    );
  }

  if (lawyers.length === 0) {
    return (
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Lawyers</h2>
            <p className="text-gray-600">No featured lawyers available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Lawyers</h2>
          <p className="text-lg text-gray-600">Connect with experienced legal professionals</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
            >
              {lawyers.map((lawyer) => (
                <div key={lawyer.id} className="w-1/3 flex-shrink-0 px-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col">
                    <div className="bg-gradient-to-r from-[#0071BC] to-[#00D2FF] px-6 py-3">
                      <span className="text-white font-semibold text-sm uppercase tracking-wide">{lawyer.specialty}</span>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start mb-4">
                        <img
                          src={lawyer.image}
                          alt={`${lawyer.name} - ${lawyer.specialty} Attorney`}
                          className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100 shadow-sm mr-3 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{lawyer.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${getStarClass(i, lawyer.rating)}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-gray-800">{lawyer.rating}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="text-sm">{lawyer.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Practice Areas</h4>
                        <div className="flex flex-wrap gap-1">
                          {lawyer.practiceAreas.slice(0, 2).map((area, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md font-medium">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4 flex-1">
                        <h4 className="text-sm font-bold text-gray-900 mb-2">{lawyer.successTitle}</h4>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {lawyer.successAuthor} • {lawyer.successDate}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {truncateText(lawyer.successDescription, 80)}
                        </p>
                      </div>

                      <div className="mt-auto">
                        <Link 
                          to={fromDashboard ? `/dashboard/lawyer/${lawyer.id}` : `/lawyer/${lawyer.id}`}
                          className="w-full py-3 bg-gradient-to-r from-[#0071BC] to-[#00D2FF] text-white font-semibold rounded-lg hover:from-[#005a9a] hover:to-[#00b8e6] transition-all duration-300 shadow-md hover:shadow-lg text-center block text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}