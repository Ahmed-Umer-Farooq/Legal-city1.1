import { Star, MapPin } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function LawyersCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  
  const fromDashboard = user && location.pathname === '/dashboard/find-lawyer';

  const lawyers = [
    {
      id: "5ffe4a13e0e06fa22e6415467340d577",
      name: "Nedime Acikli",
      specialty: "Corporate Law",
      rating: 4.9,
      reviews: 127,
      location: "London, UK",
      practiceAreas: ["Corporate Law", "Business Litigation", "Contract Law"],
      successTitle: "Recent Success",
      successAuthor: "Client Review",
      successDate: "Oct 2024",
      successDescription: "Exceptional legal expertise in corporate matters. Nedime provided strategic guidance that saved our company significant costs and resolved complex contract disputes efficiently.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "5f0852c78a0b2934a62701e85369b528",
      name: "Melek Arican",
      specialty: "Family Law",
      rating: 4.8,
      reviews: 89,
      location: "Birmingham, UK",
      practiceAreas: ["Family Law", "Divorce", "Child Custody"],
      successTitle: "Client Testimonial",
      successAuthor: "Verified Client",
      successDate: "Sep 2024",
      successDescription: "Compassionate and professional approach to family law matters. Melek guided us through a difficult divorce process with empathy and achieved the best possible outcome for our children.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "aa9bd209b2e44b7d2fd4a168ba440ff8",
      name: "Nika Monhart",
      specialty: "Criminal Defense",
      rating: 4.9,
      reviews: 156,
      location: "Manchester, UK",
      practiceAreas: ["Criminal Defense", "White Collar Crime", "Appeals"],
      successTitle: "Case Victory",
      successAuthor: "Court Record",
      successDate: "Nov 2024",
      successDescription: "Outstanding criminal defense representation. Nika's thorough preparation and courtroom expertise resulted in a complete dismissal of charges in a complex white-collar case.",
      image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7",
      name: "James Wilson",
      specialty: "Personal Injury",
      rating: 4.7,
      reviews: 203,
      location: "Liverpool, UK",
      practiceAreas: ["Personal Injury", "Medical Malpractice", "Workers Compensation"],
      successTitle: "Major Settlement",
      successAuthor: "Client Testimonial",
      successDate: "Dec 2024",
      successDescription: "James secured a substantial settlement for my injury case. His dedication and expertise made all the difference in achieving a favorable outcome.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
      name: "Sarah Thompson",
      specialty: "Immigration Law",
      rating: 4.8,
      reviews: 142,
      location: "Edinburgh, UK",
      practiceAreas: ["Immigration Law", "Visa Applications", "Citizenship"],
      successTitle: "Successful Case",
      successAuthor: "Happy Client",
      successDate: "Nov 2024",
      successDescription: "Sarah helped me navigate the complex immigration process with professionalism and care. Her expertise was invaluable in securing my visa.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: "d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
      name: "David Chen",
      specialty: "Real Estate Law",
      rating: 4.6,
      reviews: 98,
      location: "Cardiff, UK",
      practiceAreas: ["Real Estate Law", "Property Disputes", "Commercial Leasing"],
      successTitle: "Property Victory",
      successAuthor: "Satisfied Client",
      successDate: "Oct 2024",
      successDescription: "David's expertise in real estate law helped resolve our property dispute efficiently. His attention to detail was exceptional.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

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