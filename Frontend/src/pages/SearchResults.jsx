import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Mail, Filter } from 'lucide-react';

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [searchParams, setSearchParams] = useState({});

  // Mock lawyers data
  const allLawyers = [
    {
      id: 1,
      name: "Christopher McLane",
      specialty: "Family Law",
      location: "Golden, CO",
      rating: 5.0,
      reviews: 69,
      phone: "(303) 731-5402",
      email: "chris@mountainfamilylaw.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      practiceAreas: ["Family Law", "Divorce", "Child Custody"],
      yearsExperience: 16
    },
    {
      id: 2,
      name: "Sarah Johnson",
      specialty: "Corporate Law",
      location: "Denver, CO",
      rating: 4.9,
      reviews: 127,
      phone: "(555) 123-4567",
      email: "sarah@lawfirm.com",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      practiceAreas: ["Corporate Law", "Business Law", "Contract Law"],
      yearsExperience: 15
    },
    {
      id: 3,
      name: "Michael Chen",
      specialty: "Criminal Defense",
      location: "Boulder, CO",
      rating: 4.8,
      reviews: 89,
      phone: "(555) 987-6543",
      email: "michael@lawfirm.com",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      practiceAreas: ["Criminal Defense", "DUI Defense", "White Collar Crime"],
      yearsExperience: 12
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      specialty: "Personal Injury",
      location: "Colorado Springs, CO",
      rating: 4.9,
      reviews: 156,
      phone: "(555) 456-7890",
      email: "emily@lawfirm.com",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      practiceAreas: ["Personal Injury", "Medical Malpractice", "Car Accidents"],
      yearsExperience: 10
    }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchData = {
      lawyer: params.get('lawyer') || '',
      specialty: params.get('specialty') || '',
      location: params.get('location') || ''
    };
    setSearchParams(searchData);

    // Filter lawyers based on search criteria
    let filtered = allLawyers;

    if (searchData.lawyer) {
      filtered = filtered.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchData.lawyer.toLowerCase())
      );
    }

    if (searchData.specialty) {
      filtered = filtered.filter(lawyer => 
        lawyer.specialty.toLowerCase().includes(searchData.specialty.toLowerCase()) ||
        lawyer.practiceAreas.some(area => 
          area.toLowerCase().includes(searchData.specialty.toLowerCase())
        )
      );
    }

    if (searchData.location) {
      filtered = filtered.filter(lawyer => 
        lawyer.location.toLowerCase().includes(searchData.location.toLowerCase())
      );
    }

    setFilteredLawyers(filtered);
  }, [location.search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="text-gray-600 mt-1">
                Found {filteredLawyers.length} lawyers matching your criteria
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Search Summary */}
          {(searchParams.lawyer || searchParams.specialty || searchParams.location) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchParams.lawyer && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  Lawyer: {searchParams.lawyer}
                </span>
              )}
              {searchParams.specialty && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Specialty: {searchParams.specialty}
                </span>
              )}
              {searchParams.location && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  Location: {searchParams.location}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredLawyers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all lawyers.</p>
            <button 
              onClick={() => navigate('/lawyers')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Lawyers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{lawyer.name}</h3>
                    <p className="text-blue-600 font-medium mb-2">{lawyer.specialty}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(lawyer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {lawyer.rating} ({lawyer.reviews} reviews)
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {lawyer.location}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Practice Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.practiceAreas.slice(0, 3).map((area, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{lawyer.yearsExperience}+ years experience</span>
                  <button 
                    onClick={() => navigate(`/lawyer/${lawyer.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}