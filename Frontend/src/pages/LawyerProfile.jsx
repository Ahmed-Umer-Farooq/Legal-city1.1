import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Star, Phone, Mail, MapPin, Award, Calendar, Shield, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/layout/DashboardHeader';
import { toast } from 'sonner';
import api from '../utils/api';

export default function LawyerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user came from dashboard vs public pages
  const cameFromDashboard = user && localStorage.getItem('navigatedFromDashboard') === 'true';
  
  useEffect(() => {
    fetchLawyer();
    // Clear flag if no user
    if (!user) {
      localStorage.removeItem('navigatedFromDashboard');
    }
  }, [id, user]);
  
  const fetchLawyer = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lawyers/${id}`);
      setLawyer(response.data);
    } catch (error) {
      console.error('Error fetching lawyer:', error);
      toast.error('Failed to load lawyer profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChatWithLawyer = () => {
    if (user && cameFromDashboard) {
      const chatData = {
        partner_id: parseInt(id),
        partner_type: 'lawyer',
        partner_name: lawyer.name
      };
      localStorage.setItem('chatPartner', JSON.stringify(chatData));
      localStorage.removeItem('navigatedFromDashboard');
      navigate('/user/messages');
    } else {
      toast.error('Please login to chat with lawyers');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lawyer profile...</p>
        </div>
      </div>
    );
  }
  
  if (!lawyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lawyer not found</p>
          <button 
            onClick={() => navigate('/lawyers')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }
  
  // Format lawyer data for display
  const displayLawyer = {
    ...lawyer,
    title: lawyer.speciality || 'Attorney',
    location: `${lawyer.city || 'Unknown'}, ${lawyer.state || 'Unknown'}`,
    rating: 5.0,
    reviews: Math.floor(Math.random() * 50) + 10,
    phone: lawyer.mobile_number || 'Contact for phone',
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}&background=0284c7&color=fff&size=200`,
    yearsLicensed: Math.floor(Math.random() * 15) + 5,
    freeConsultation: true,
    virtualConsultation: true,
    about: lawyer.description || `Experienced ${lawyer.speciality || 'legal'} attorney with expertise in various legal matters.`,
    practiceAreas: [
      { name: lawyer.speciality || 'General Practice', percentage: 100, years: Math.floor(Math.random() * 15) + 5 }
    ],
    awards: ['Licensed Attorney', 'Verified Professional'],
    hourlyRate: '$300-500',
    address: `${lawyer.address || ''}, ${lawyer.city || ''}, ${lawyer.state || ''} ${lawyer.zip_code || ''}`.replace(/^,\s*|,\s*$/g, ''),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show back to directory header for users from dashboard */}
      {user && cameFromDashboard && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate('/user/lawyer-directory')}
              className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20"
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="font-semibold text-lg">Back to Lawyer Directory</span>
            </button>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={displayLawyer.image}
                alt={displayLawyer.name}
                className="w-32 h-32 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayLawyer.name}</h1>
                  <p className="text-xl text-blue-600 mb-2">{displayLawyer.title}</p>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{displayLawyer.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-lg font-semibold">{displayLawyer.rating}</span>
                      <span className="ml-1 text-gray-600">({displayLawyer.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200">
                      Licensed {displayLawyer.yearsLicensed} years
                    </span>
                    {displayLawyer.freeConsultation && (
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
                        Free Consultation
                      </span>
                    )}
                    {displayLawyer.virtualConsultation && (
                      <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md text-sm font-medium border border-purple-200">
                        Virtual Available
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => window.location.href = `tel:${displayLawyer.phone}`}
                    className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                  >
                    <Phone className="w-5 h-5" />
                    {displayLawyer.phone}
                  </button>
                  <button 
                    onClick={handleChatWithLawyer}
                    className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold cursor-pointer transition-colors ${
                      user && cameFromDashboard 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700' 
                        : 'bg-gray-400 text-white hover:bg-gray-500'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{user && cameFromDashboard ? 'Click to Chat' : 'Login to Chat'}</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium">
                    Visit Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{displayLawyer.about}</p>
            </div>

            {/* Practice Areas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">Practice Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayLawyer.practiceAreas.map((area, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{area.name}</h3>
                      <span className="text-2xl font-bold text-blue-600">{area.percentage}%</span>
                    </div>
                    <p className="text-gray-600">{area.years} years experience</p>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{displayLawyer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{lawyer.email || 'Contact for email'}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-gray-700">{displayLawyer.address}</span>
                </div>
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-semibold">{displayLawyer.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free Consultation:</span>
                  <span className="font-semibold text-green-600">30 minutes</span>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Awards & Recognition</h3>
              <div className="space-y-2">
                {displayLawyer.awards.map((award, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700">{award}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Schedule Consultation</span>
                </button>
                <button 
                  onClick={handleChatWithLawyer}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    user && cameFromDashboard
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100 border border-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    user && cameFromDashboard ? 'bg-green-100' : 'bg-gray-200'
                  }`}>
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">{user && cameFromDashboard ? 'Click to Chat' : 'Login to Chat'}</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Request Quote</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}