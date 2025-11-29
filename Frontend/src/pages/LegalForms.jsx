import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LegalForms() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    practiceOrName: '',
    location: '',
    caseDetails: ''
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchData.practiceOrName) queryParams.append('practice', searchData.practiceOrName);
    if (searchData.location) queryParams.append('location', searchData.location);
    if (searchData.caseDetails) queryParams.append('details', searchData.caseDetails);
    navigate(`/lawyers?${queryParams.toString()}`);
  };



  return (
    <>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#F8FAFC] via-[#E6F0FF] to-[#F1F5F9] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center">
            <div className="inline-block bg-[#CFE0FF] text-[#1846A3] px-6 py-3 rounded-full text-sm font-semibold mb-8">
              Professional Legal Resources
            </div>
            <h1 className="text-5xl font-bold text-[#111827] mb-6 leading-tight">
              Legal Forms & Attorney Directory
            </h1>
            <p className="text-xl text-[#4B5563] mb-12 max-w-3xl mx-auto">
              Access professional legal documents and connect with qualified attorneys across all practice areas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/lawyers')}
                className="bg-[#2973FF] hover:bg-[#1F5AD1] text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Browse Attorney Directory
              </button>
              <button
                onClick={() => navigate('/qa')}
                className="bg-white hover:bg-gray-50 text-[#2973FF] border border-[#2973FF] font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Ask Legal Question
              </button>
            </div>
          </div>
        </div>
      </section>



      {/* Trust Indicators */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#E6F0FF] rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-[#2973FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">50,000+</div>
              <div className="text-sm text-gray-600">Verified Attorneys</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FEF3C7] rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">&lt; 2hrs</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#EDE9FE] rounded-full flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-[#7C3AED]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-gray-900">$5.2B+</div>
              <div className="text-sm text-gray-600">Cases Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Legal Forms */}
      <section className="bg-[#F9FAFB] py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Professional Legal Forms & Templates</h2>
            <p className="text-lg text-[#4B5563]">Attorney-reviewed documents ready for immediate use. Save time and ensure compliance.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business Forms */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#2973FF] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-4">Business forms, templates, and examples</h3>
                <ul className="space-y-2 mb-6">
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    LLC operating agreement
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Partnership agreement
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Independent contractor agreement
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Non-disclosure agreement
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/forms/business')}
                  className="w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#2973FF] font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Browse business forms
                </button>
              </div>
            </div>

            {/* Estate Planning Forms */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#7C3AED] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-4">Estate planning forms, templates, and examples</h3>
                <ul className="space-y-2 mb-6">
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Last will and testament
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Living trust
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Power of attorney
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advance healthcare directive
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/forms/estate-planning')}
                  className="w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#7C3AED] font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Browse estate forms
                </button>
              </div>
            </div>

            {/* Real Estate Forms */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#10B981] rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#111827] mb-4">Real estate forms, templates, and examples</h3>
                <ul className="space-y-2 mb-6">
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Residential lease agreement
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Commercial lease
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Purchase and sale agreement
                  </li>
                  <li className="text-[#4B5563] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#10B981]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Lease termination notice
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/forms/real-estate')}
                  className="w-full bg-[#F9FAFB] hover:bg-[#E5E7EB] text-[#10B981] font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Browse real estate forms
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Comprehensive Legal Services</h2>
            <p className="text-lg text-[#4B5563]">From consultation to representation, we connect you with the right legal expertise.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2973FF] to-[#1F5AD1] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Consultation</h3>
              <p className="text-gray-600 mb-6">Get expert advice from qualified attorneys. Initial consultations available within 24 hours.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  30-minute free consultation
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Licensed attorneys only
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Confidential & secure
                </li>
              </ul>
              <button className="w-full bg-[#2973FF] hover:bg-[#1F5AD1] text-white font-semibold py-3 rounded-lg transition-colors">
                Schedule Consultation
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Document Review</h3>
              <p className="text-gray-600 mb-6">Professional review of contracts, agreements, and legal documents by experienced attorneys.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  48-hour turnaround
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Detailed feedback
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Risk assessment
                </li>
              </ul>
              <button className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-semibold py-3 rounded-lg transition-colors">
                Upload Document
              </button>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Legal Representation</h3>
              <p className="text-gray-600 mb-6">Full legal representation for complex matters. Connect with specialized attorneys in your area.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Experienced litigators
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Transparent pricing
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Case management tools
                </li>
              </ul>
              <button className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold py-3 rounded-lg transition-colors">
                Find Attorney
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Topics */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111827] mb-4">Practice Areas & Legal Expertise</h2>
            <p className="text-lg text-[#4B5563]">Comprehensive legal guidance across all major practice areas with specialized attorneys.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'administrative_law', label: 'Administrative law', color: '#2973FF' },
              { id: 'alternative_dispute_resolution', label: 'Alternative dispute resolution', color: '#10B981' },
              { id: 'banking_finance', label: 'Banking & finance', color: '#7C3AED' },
              { id: 'benefits_social_welfare', label: 'Benefits & social welfare', color: '#F59E0B' },
              { id: 'construction_law', label: 'Construction law', color: '#EF4444' },
              { id: 'cybersecurity_privacy', label: 'Cybersecurity & privacy', color: '#3B82F6' },
              { id: 'elder_law', label: 'Elder law', color: '#10B981' },
              { id: 'environmental_law', label: 'Environmental law', color: '#7C3AED' },
              { id: 'franchise_law', label: 'Franchise law', color: '#F59E0B' },
              { id: 'healthcare_law', label: 'Healthcare law', color: '#EF4444' },
              { id: 'housing_landlord_tenant', label: 'Housing (landlord–tenant)', color: '#2973FF' },
              { id: 'insurance_law', label: 'Insurance law', color: '#10B981' },
              { id: 'international_trade', label: 'International trade', color: '#3B82F6' },
              { id: 'nonprofit_law', label: 'Nonprofit & charities', color: '#7C3AED' },
              { id: 'public_interest', label: 'Public interest law', color: '#F59E0B' }
            ].map((topic) => (
              <button
                key={topic.id}
                onClick={() => navigate(`/topics/${topic.id}`)}
                className="bg-white hover:bg-gray-50 text-[#111827] font-semibold py-3 px-4 rounded-full border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 text-sm"
                style={{ borderLeftColor: topic.color, borderLeftWidth: '4px' }}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}