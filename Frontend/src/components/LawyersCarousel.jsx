import { Star, MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function LawyersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if accessed from dashboard
  const fromDashboard = user && location.pathname === '/dashboard/find-lawyer';

  const lawyers = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Corporate Law",
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
      phone: "(555) 123-4567",
      email: "sarah@lawfirm.com",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      experience: "15+ years"
    },
    {
      id: 2,
      name: "Michael Chen",
      specialty: "Criminal Defense",
      rating: 4.8,
      reviews: 89,
      location: "Los Angeles, CA",
      phone: "(555) 987-6543",
      email: "michael@lawfirm.com",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      experience: "12+ years"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      specialty: "Family Law",
      rating: 4.9,
      reviews: 156,
      location: "Chicago, IL",
      phone: "(555) 456-7890",
      email: "emily@lawfirm.com",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      experience: "10+ years"
    },
    {
      id: 4,
      name: "David Thompson",
      specialty: "Personal Injury",
      rating: 4.7,
      reviews: 203,
      location: "Houston, TX",
      phone: "(555) 321-0987",
      email: "david@lawfirm.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      experience: "18+ years"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, lawyers.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, lawyers.length - 2)) % Math.max(1, lawyers.length - 2));
  };

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
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <img
                        src={lawyer.image}
                        alt={lawyer.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                        <p className="text-lawyer-blue font-medium">{lawyer.specialty}</p>
                        <p className="text-sm text-gray-500">{lawyer.experience}</p>
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
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
                      <span className="ml-2 text-sm text-gray-600">
                        {lawyer.rating} ({lawyer.reviews} reviews)
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {lawyer.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        {lawyer.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {lawyer.email}
                      </div>
                    </div>

                    <Link 
                      to={fromDashboard ? `/dashboard/lawyer/${lawyer.id}` : `/lawyer/${lawyer.id}`}
                      className="w-full bg-lawyer-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                    >
                      View Profile
                    </Link>
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