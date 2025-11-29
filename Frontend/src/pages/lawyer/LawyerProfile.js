import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import api from '../../utils/api';

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [maritalStatus, setMaritalStatus] = useState('');
  const [hasChildren, setHasChildren] = useState('');
  const [message, setMessage] = useState('');
  const [phoneCall, setPhoneCall] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timePreference, setTimePreference] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLawyerProfile();
  }, [id]);

  const fetchLawyerProfile = async () => {
    try {
      const response = await api.get(`/lawyers/${id}`);
      setLawyer(response.data);
    } catch (error) {
      toast.error('Failed to load lawyer profile');
      console.error('Error fetching lawyer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeToggle = (time) => {
    setTimePreference((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please provide details about your situation');
      return;
    }

    if (phoneCall && !phoneNumber) {
      toast.error('Please provide your phone number');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/lawyers/${id}/message`, {
        maritalStatus,
        hasChildren,
        message,
        phoneCall,
        phoneNumber: phoneCall ? phoneNumber : null,
        timePreference: phoneCall ? timePreference : [],
      });
      
      toast.success('Message sent successfully!');
      
      // Reset form
      setMaritalStatus('');
      setHasChildren('');
      setMessage('');
      setPhoneNumber('');
      setTimePreference([]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 w-full px-4 md:px-36 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 w-full px-4 md:px-36 py-6">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-lg text-gray-600 mb-4">Lawyer not found</div>
            <button
              onClick={() => navigate('/lawyer-directory')}
              className="px-6 py-2 bg-gradient-to-b from-[#0071BC] to-[#00D2FF] text-white rounded hover:opacity-90"
            >
              Back to Directory
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 w-full px-4 md:px-36 py-8 bg-white">
        <h1 className="text-[26px] font-normal text-[#333] mb-8">
          Message: <span className="font-normal">{lawyer.name || 'Lawyer'}</span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Lawyer Profile Section */}
          <div className="w-full lg:w-auto lg:flex-shrink-0">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  src={lawyer.profile_picture || 'https://via.placeholder.com/112x152'}
                  alt={lawyer.name}
                  className="w-28 h-[152px] object-cover flex-shrink-0"
                />

                <div className="flex flex-col gap-3">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="15"
                          height="16"
                          viewBox="0 0 15 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.8581 5.77846C14.8581 5.90941 14.7807 6.05227 14.626 6.20703L11.3849 9.36775L12.1528 13.832C12.1587 13.8737 12.1617 13.9332 12.1617 14.0106C12.1617 14.1356 12.1304 14.2413 12.0679 14.3276C12.0054 14.4139 11.9147 14.457 11.7956 14.457C11.6825 14.457 11.5635 14.4213 11.4385 14.3499L7.42955 12.2427L3.42062 14.3499C3.28967 14.4213 3.17062 14.457 3.06348 14.457C2.93848 14.457 2.84473 14.4139 2.78223 14.3276C2.71973 14.2413 2.68848 14.1356 2.68848 14.0106C2.68848 13.9749 2.69443 13.9154 2.70633 13.832L3.47419 9.36775L0.224191 6.20703C0.0753813 6.04632 0.000976562 5.90346 0.000976562 5.77846C0.000976562 5.55822 0.167643 5.42132 0.500977 5.36775L4.98312 4.71596L6.99205 0.65346C7.10514 0.409411 7.25098 0.287388 7.42955 0.287388C7.60812 0.287388 7.75395 0.409411 7.86705 0.65346L9.87598 4.71596L14.3581 5.36775C14.6915 5.42132 14.8581 5.55822 14.8581 5.77846Z"
                            fill="#FC9835"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-[#333] opacity-70">
                      ({lawyer.reviews_count || 69} reviews)
                    </span>
                  </div>

                  {/* Address */}
                  <div className="text-[15px] text-[#333] leading-6">
                    {lawyer.address || '120 Court St, Riverhead, NY, 11901-3003'}
                  </div>

                  {/* Practice Areas */}
                  <div className="flex flex-col gap-1">
                    <div className="text-xs text-[#333] opacity-70 tracking-[1.68px] uppercase">
                      PRACTICE AREAS
                    </div>
                    <div className="text-[15px] text-[#333] leading-6 whitespace-pre-line">
                      {lawyer.practice_areas || 'Family, Alimony, Adoption, Child\nabuse, Child custody, Child\nsupport, Divorce and separation,\nDomestic violence, Marriage and\nprenuptials'}
                    </div>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 text-base text-transparent bg-clip-text bg-gradient-to-b from-[#0071BC] to-[#00D2FF] w-fit hover:opacity-80 transition-opacity font-normal">
                <svg
                  width="12"
                  height="16"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0"
                >
                  <path
                    d="M9.08622 7.83036L2.46122 14.4554C2.34812 14.5685 2.21419 14.625 2.05943 14.625C1.90467 14.625 1.77074 14.5685 1.65765 14.4554L0.175502 12.9732C0.062407 12.8601 0.00585938 12.7262 0.00585938 12.5714C0.00585938 12.4167 0.062407 12.2827 0.175502 12.1696L4.91657 7.42857L0.175502 2.6875C0.062407 2.5744 0.00585938 2.44048 0.00585938 2.28571C0.00585938 2.13095 0.062407 1.99702 0.175502 1.88393L1.65765 0.401785C1.77074 0.28869 1.90467 0.232142 2.05943 0.232142C2.21419 0.232142 2.34812 0.28869 2.46122 0.401785L9.08622 7.02679C9.19931 7.13988 9.25586 7.27381 9.25586 7.42857C9.25586 7.58333 9.19931 7.71726 9.08622 7.83036Z"
                    fill="#008CC9"
                  />
                </svg>
                View full profile
              </button>
            </div>
          </div>

          {/* Message Form Section */}
          <div className="flex-1 lg:max-w-[756px]">
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              {/* Marital Status */}
              <div className="flex flex-col gap-3">
                <label className="text-[15px] font-bold text-[#333]">
                  Marital status:
                </label>
                <select 
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[#CCC] bg-white text-[15px] text-[#333] appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center'
                  }}
                >
                  <option value="">Select an answer</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="separated">Separated</option>
                </select>
              </div>

              {/* Children */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#333]">
                  Do you have children?
                </label>
                <select 
                  value={hasChildren}
                  onChange={(e) => setHasChildren(e.target.value)}
                  className="w-full h-[38px] px-3 border border-[#CCC] bg-white text-[15px] text-[#333] appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center'
                  }}
                >
                  <option value="">Select an answer</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-3">
                <p className="text-[15px] text-[#333] leading-6">
                  Provide some details about your situation, but remember not to include
                  sensitive information. An attorney-client relationship is only formed
                  once an attorney formally agrees to represent you.
                </p>
                <div className="relative">
                  <div className="absolute right-0 -top-5 text-xs text-[#333] opacity-70">
                    {message.length}/2000
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                    className="w-full h-40 p-3 border border-[#CCC] bg-white text-[15px] text-[#333] resize-none focus:outline-none focus:border-[#0071BC]"
                    placeholder="Describe your legal situation..."
                  />
                </div>
              </div>

              {/* Phone Call Preference */}
              <div className="flex flex-col gap-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative flex-shrink-0 w-4 h-4 mt-0.5">
                    <input
                      type="checkbox"
                      checked={phoneCall}
                      onChange={(e) => setPhoneCall(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-full h-full ${
                        phoneCall
                          ? 'bg-gradient-to-b from-[#0071BC] to-[#00D2FF]'
                          : 'border border-[#767676] bg-white'
                      }`}
                    >
                      {phoneCall && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-[15px] text-[#333]">
                    I prefer that this attorney replies to my message with a phone call (optional).
                  </span>
                </label>

                {phoneCall && (
                  <div className="flex flex-col gap-4 pl-7">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="US phone numbers only"
                      className="w-full lg:w-[366px] h-[38px] px-3 border border-[#CCC] bg-white text-[15px] placeholder:text-[#333] placeholder:opacity-40 focus:outline-none focus:border-[#0071BC]"
                    />

                    <div className="flex flex-col gap-3">
                      <label className="text-[15px] text-[#333]">What time is best?</label>
                      <div className="flex flex-wrap gap-6">
                        {['Morning', 'Afternoon', 'Evening'].map((time) => (
                          <label key={time} className="flex items-center gap-2 cursor-pointer">
                            <div className="relative w-4 h-4">
                              <input
                                type="checkbox"
                                checked={timePreference.includes(time)}
                                onChange={() => handleTimeToggle(time)}
                                className="sr-only"
                              />
                              <div
                                className={`w-full h-full ${
                                  timePreference.includes(time)
                                    ? 'bg-gradient-to-b from-[#0071BC] to-[#00D2FF]'
                                    : 'border border-[#767676] bg-white'
                                }`}
                              >
                                {timePreference.includes(time) && (
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                                  >
                                    <path
                                      d="M1 4L3.5 6.5L9 1"
                                      stroke="white"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className="text-base text-[#333]">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-fit px-10 py-2 bg-gradient-to-b from-[#0071BC] to-[#00D2FF] text-white text-[15px] hover:opacity-90 transition-opacity disabled:opacity-50 font-normal"
              >
                {submitting ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <header className="w-full h-16 bg-gradient-to-b from-[#0071BC] to-[#00D2FF] flex items-center justify-between px-4 md:px-36">
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
        <svg width="126" height="29" viewBox="0 0 126 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7">
          <path d="M3.42081 14.5C3.42081 10.4744 5.2689 6.83289 8.25537 4.20676C11.2078 1.60532 15.273 0 19.7584 0H66.2189C75.2408 0 82.5565 6.49262 82.5565 14.5C82.5565 22.5074 75.2408 29 66.2189 29H19.7584C16.1644 29 12.8401 27.9655 10.1432 26.2202C7.71882 26.4068 7.66205 26.9529 0 29C4.10781 23.3416 3.42081 22.9711 3.42081 14.5Z" fill="white"/>
          <path d="M85.3018 13.5722C85.3018 8.79467 89.0206 5.57031 93.8438 5.57031C97.347 5.57031 99.3881 7.40339 100.515 9.35173L97.5883 10.743C96.9155 9.49168 95.4762 8.49281 93.8438 8.49281C90.917 8.49281 88.8049 10.6497 88.8049 13.5722C88.8049 16.4947 90.917 18.6516 93.8438 18.6516C95.4762 18.6516 96.9155 17.6527 97.5883 16.4014L100.515 17.7707C99.3881 19.6971 97.347 21.5741 93.8438 21.5741C89.0206 21.5741 85.3018 18.3278 85.3018 13.5722Z" fill="white"/>
          <path d="M101.597 7.12259C101.597 6.14843 102.411 5.38281 103.397 5.38281C104.404 5.38281 105.219 6.14843 105.219 7.12259C105.219 8.09676 104.404 8.88433 103.397 8.88433C102.411 8.88433 101.597 8.09676 101.597 7.12259ZM101.883 21.296V10.0917H104.932V21.296H101.883Z" fill="white"/>
          <path d="M107.978 18.4907V12.6677H106.059V10.0937H107.978V7.03125H111.027V10.0937H113.377V12.6677H111.027V17.7004C111.027 18.4194 111.41 18.9518 112.083 18.9518C112.537 18.9518 112.971 18.7899 113.139 18.6033L113.786 20.8534C113.332 21.2486 112.514 21.5724 111.242 21.5724C109.108 21.5752 107.978 20.5077 107.978 18.4907Z" fill="white"/>
          <path d="M114.913 23.0339C115.177 23.1492 115.586 23.2205 115.873 23.2205C116.665 23.2205 117.193 23.012 117.479 22.4083L117.911 21.4341L113.207 10.0898H116.472L119.495 17.8832L122.544 10.0898H125.809L120.361 23.1272C119.498 25.2375 117.962 25.7945 115.969 25.8412C115.634 25.8412 114.842 25.7726 114.482 25.6546L114.913 23.0339Z" fill="white"/>
          <path d="M16.4023 21.1047V5.92969H19.7664V18.2618H26.4036V21.1047H16.4023Z" fill="#0078C0"/>
          <path d="M27.0176 15.5982C27.0176 12.415 29.4647 9.84375 32.9025 9.84375C36.3148 9.84375 38.5972 12.2997 38.5972 15.8726V16.5559H30.1488C30.3617 17.8978 31.4916 19.0119 33.4192 19.0119C34.3844 19.0119 35.7016 18.625 36.4312 17.9417L37.7711 19.8516C36.6413 20.8532 34.8528 21.3773 33.087 21.3773C29.6293 21.3773 27.0176 19.1244 27.0176 15.5982ZM32.9025 12.2092C31.0431 12.2092 30.2425 13.4605 30.1261 14.5527H35.7272C35.6306 13.5072 34.8783 12.2092 32.9025 12.2092Z" fill="#0078C0"/>
          <path d="M39.9393 23.9278L41.2792 21.856C42.1962 22.8109 43.4225 23.1979 44.8334 23.1979C46.2699 23.1979 47.9874 22.6051 47.9874 20.3769V19.3094C47.0932 20.4016 45.8696 21.0163 44.4587 21.0163C41.6341 21.0163 39.4453 19.1036 39.4453 15.4429C39.4453 11.8481 41.5858 9.84766 44.4587 9.84766C45.8242 9.84766 47.0705 10.3937 47.9874 11.5326V10.1221H50.9767V20.3824C50.9767 24.5452 47.6354 25.5688 44.8334 25.5688C42.903 25.566 41.3729 25.1325 39.9393 23.9278ZM47.9874 17.2157V13.6428C47.4707 12.9376 46.3863 12.4134 45.4211 12.4134C43.7036 12.4134 42.5255 13.5495 42.5255 15.4375C42.5255 17.3254 43.7007 18.4642 45.4211 18.4642C46.3863 18.467 47.4679 17.9209 47.9874 17.2157Z" fill="#0078C0"/>
          <path d="M60.1779 21.1045V19.9437C59.4001 20.8548 58.0602 21.3762 56.5783 21.3762C54.7671 21.3762 52.6465 20.1935 52.6465 17.7347C52.6465 15.1415 54.7643 14.1866 56.5783 14.1866C58.1084 14.1866 59.4256 14.664 60.1779 15.5284V14.1399C60.1779 13.0258 59.19 12.2986 57.6826 12.2986C56.4818 12.2986 55.3519 12.7541 54.4122 13.5938L53.2341 11.5686C54.6223 10.364 56.4108 9.83984 58.1993 9.83984C60.811 9.83984 63.19 10.8415 63.19 14.0027V21.1018H60.1779V21.1045ZM60.1779 18.4647V17.1008C59.684 16.4642 58.7415 16.1239 57.7763 16.1239C56.5982 16.1239 55.633 16.7386 55.633 17.7841C55.633 18.8296 56.5982 19.4224 57.7763 19.4224C58.7443 19.4196 59.684 19.1013 60.1779 18.4647Z" fill="#0078C0"/>
        </svg>
      </div>

      <div className="flex items-center gap-3">
        {/* Admin Panel - Only show for admin users */}
        {user && (user.role === 'admin' || user.is_admin) && (
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="text-white hover:opacity-90 transition-opacity text-sm"
          >
            Admin Panel
          </button>
        )}

        <button 
          onClick={() => navigate('/login')}
          className="text-white hover:opacity-90 transition-opacity text-sm"
        >
          Login
        </button>

        <button 
          onClick={() => navigate('/register')}
          className="flex items-center justify-center h-[38px] px-7 bg-white rounded-full text-black text-sm hover:bg-gray-100 transition-colors font-medium"
        >
          Signup
        </button>
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  const footerSections = [
    {
      title: "Browse Our Site",
      links: [
        "Find a Lawyer",
        "Review Your Lawyer",
        "Legal Advice",
        "Recently Answered Questions",
        "Browse Practice Areas",
        "Avvo Stories Blog",
      ],
    },
    {
      title: "Popular Locations",
      links: [
        "New York City Lawyers",
        "Los Angeles Lawyers",
        "Chicago Lawyers",
        "Houston Lawyers",
        "Washington, DC Lawyers",
        "Philadelphia Lawyers",
        "Phoenix Lawyers",
        "San Antonio Lawyers",
        "San Diego Lawyers",
      ],
    },
    {
      title: "Popular Practice Areas",
      links: [
        "Bankruptcy & Debt Lawyers",
        "Business Lawyers",
        "Criminal Defense Lawyers",
        "DUI & DWI Lawyers",
        "Estate Planning Lawyers",
        "Car Accident Lawyers",
        "Divorce & Separation Lawyers",
        "Intellectual Property Lawyers",
        "Speeding & Traffic Lawyers",
      ],
    },
    {
      title: "About",
      links: [
        "About Avvo",
        "Careers",
        "Support",
        "Avvo Rating Explained",
      ],
    },
  ];

  const footerLinks = [
    "Terms of Use",
    "Privacy Policy",
    "Do Not Sell or Share My Personal Information",
    "Community Guidelines",
    "Sitemap",
  ];

  return (
    <footer className="w-full bg-[#333] px-4 md:px-36 py-10">
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h3 className="text-white text-base font-bold mb-1">
                {section.title}
              </h3>
              {section.links.map((link, linkIndex) => (
                <a
                  key={linkIndex}
                  href="#"
                  className="text-[#CCC] text-sm leading-[21px] hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm">
          {footerLinks.map((link, index) => (
            <div key={index} className="flex items-center">
              <a
                href="#"
                className="text-[#CCC] hover:text-white transition-colors font-['Lato']"
              >
                {link}
              </a>
              {index < footerLinks.length - 1 && (
                <span className="ml-2 text-[#CCC]">|</span>
              )}
            </div>
          ))}
        </div>

        <div className="text-[#CCC] text-sm font-['Lato']">
          © Avvo Inc. All Rights Reserved 2023
        </div>
      </div>
    </footer>
  );
};

export default LawyerProfile;