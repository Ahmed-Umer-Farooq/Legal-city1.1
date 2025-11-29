import React, { useState, useEffect } from 'react';
import { Search, User, Calendar, FileText, Phone, Mail, Clock, CreditCard, Users, DollarSign, File, ChevronLeft, ChevronRight, PieChart, Home, UserCheck, BarChart3, CheckSquare, FolderOpen, MessageCircle } from 'lucide-react';
import api from '../../utils/api';

// Lazy load components to prevent import errors
const QuickActions = React.lazy(() => import('../../components/QuickActions').catch(() => ({ default: () => <div>Quick Actions Loading...</div> })));
const CreateClientModal = React.lazy(() => import('../../components/modals/CreateClientModal').catch(() => ({ default: () => null })));
const CreateEventModal = React.lazy(() => import('../../components/modals/CreateEventModal').catch(() => ({ default: () => null })));
const CreateTaskModal = React.lazy(() => import('../../components/modals/CreateTaskModal').catch(() => ({ default: () => null })));
const CreateContactModal = React.lazy(() => import('../../components/modals/CreateContactModal').catch(() => ({ default: () => null })));
const CreateCaseModal = React.lazy(() => import('../../components/modals/CreateCaseModal').catch(() => ({ default: () => null })));
const CreateNoteModal = React.lazy(() => import('../../components/modals/CreateNoteModal').catch(() => ({ default: () => null })));
const LogCallModal = React.lazy(() => import('../../components/modals/LogCallModal').catch(() => ({ default: () => null })));
const SendMessageModal = React.lazy(() => import('../../components/modals/SendMessageModal').catch(() => ({ default: () => null })));
const TrackTimeModal = React.lazy(() => import('../../components/modals/TrackTimeModal').catch(() => ({ default: () => null })));
const AddExpenseModal = React.lazy(() => import('../../components/modals/AddExpenseModal').catch(() => ({ default: () => null })));
const CreateInvoiceModal = React.lazy(() => import('../../components/modals/CreateInvoiceModal').catch(() => ({ default: () => null })));
const RecordPaymentModal = React.lazy(() => import('../../components/modals/RecordPaymentModal').catch(() => ({ default: () => null })));
const ContactsPage = React.lazy(() => import('./ContactsPage').catch(() => ({ default: () => <div>Contacts coming soon...</div> })));
const CalendarPage = React.lazy(() => import('./CalendarPage').catch(() => ({ default: () => <div>Calendar coming soon...</div> })));
const ReportsPage = React.lazy(() => import('./ReportsPage').catch(() => ({ default: () => <div>Reports coming soon...</div> })));
const TasksPage = React.lazy(() => import('./TasksPage').catch(() => ({ default: () => <div>Tasks coming soon...</div> })));
const DocumentsPage = React.lazy(() => import('./DocumentsPage').catch(() => ({ default: () => <div>Documents coming soon...</div> })));
const BlogManagement = React.lazy(() => import('./BlogManagement').catch(() => ({ default: () => <div>Blog Management coming soon...</div> })));
const ChatPage = React.lazy(() => import('../../pages/userdashboard/ChatPage').catch(() => ({ default: () => <div>Chat coming soon...</div> })));

export default function LawyerDashboard() {
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [caseTitle, setCaseTitle] = useState('');
  const [caseType, setCaseType] = useState('civil');
  const [caseClient, setCaseClient] = useState('');
  const [cases, setCases] = useState([]);
  const [stats, setStats] = useState({ activeCases: 0, totalClients: 0, monthlyRevenue: 0, upcomingHearings: 0 });
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [blogEngagementCount, setBlogEngagementCount] = useState(0);

  // Prevent browser back button
  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    
    const handlePopState = (event) => {
      event.preventDefault();
      window.history.pushState(null, '', window.location.href);
    };
    
    preventBack();
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    fetchDashboardData();
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUser(user);
    
    // Initialize chat service for notifications
    if (user?.id) {
      import('../../utils/chatService').then(({ default: chatService }) => {
        chatService.connect({ userId: user.id, userType: 'lawyer' });
        chatService.onUnreadCountUpdate(({ count }) => {
          setUnreadCount(count);
        });
        // Get initial unread count via API
        fetch('/api/chat/unread-count', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setUnreadCount(data.count || 0))
        .catch(console.error);
        
        // Get blog engagement count
        fetch('/api/blogs/engagement-count', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setBlogEngagementCount(data.count || 0))
        .catch(console.error);
      });
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, casesRes, clientsRes, invoicesRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/cases?page=1&limit=10'),
        api.get('/clients?page=1&limit=3'),
        api.get('/invoices?page=1&limit=3')
      ]);
      setStats(statsRes.data?.data || { activeCases: 0, totalClients: 0, monthlyRevenue: 0, upcomingHearings: 0 });
      setCases(Array.isArray(casesRes.data?.data) ? casesRes.data.data : []);
      setClients(Array.isArray(clientsRes.data?.data) ? clientsRes.data.data : []);
      setInvoices(Array.isArray(invoicesRes.data?.data) ? invoicesRes.data.data : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        alert('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const addCase = async () => {
    if (!caseTitle.trim()) {
      alert('Please enter a case title');
      return;
    }

    try {
      const response = await api.post('/cases', {
        title: caseTitle.trim(),
        type: caseType,
        description: caseClient.trim() ? `Case for ${caseClient.trim()}` : '',
        filing_date: new Date().toISOString().split('T')[0]
      });
      
      if (response.data?.success) {
        alert('Case created successfully!');
        setShowCaseForm(false);
        setCaseTitle('');
        setCaseClient('');
        setCaseType('civil');
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error adding case:', error);
      alert(error.response?.data?.error || 'Failed to add case. Please try again.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  const getStatusColors = (status) => {
    const colors = {
      active: 'bg-[#DCFCE7] text-[#1F5632]',
      pending: 'bg-[#FFF4E0] text-[#654C1F]',
      closed: 'bg-[#FFE3E1] text-[#931B12]',
      on_hold: 'bg-[#E5E7EB] text-[#374151]'
    };
    return colors[status?.toLowerCase()] || colors.active;
  };

  const getInvoiceStatusColors = (status) => {
    const colors = {
      paid: 'bg-[#DCFCE7] text-[#1F5632]',
      sent: 'bg-[#DBEAFE] text-[#1E40AF]',
      pending: 'bg-[#FFF4E0] text-[#654C1F]',
      draft: 'bg-[#E5E7EB] text-[#374151]',
      overdue: 'bg-[#FFE3E1] text-[#931B12]',
      cancelled: 'bg-[#F3F4F6] text-[#6B7280]'
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };



  return (
    <div className="min-h-screen bg-[#EDF4FF]">
      {/* HEADER */}
      <header className="px-4 md:px-8 lg:px-36 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 bg-white rounded-2xl px-6 py-4 w-full md:w-auto shadow-sm border border-[#F8F9FA]">
            <Search className="w-6 h-6 text-[#737791]" />
            <input 
              type="text" 
              placeholder="Search here..." 
              className="text-[#737791] text-lg bg-transparent outline-none flex-1"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 md:gap-8">
              {[
                { id: 'home', label: 'Home', icon: Home, action: () => { setActiveNavItem('home'); window.scrollTo(0, 0); } },
                { id: 'messages', label: 'Messages', icon: MessageCircle, action: () => { setActiveNavItem('messages'); }, showNotification: true },
                { id: 'contacts', label: 'Contacts', icon: UserCheck, action: () => { setActiveNavItem('contacts'); } },
                { id: 'calendar', label: 'Calendar', icon: Calendar, action: () => { setActiveNavItem('calendar'); } },
                { id: 'reports', label: 'Reports', icon: BarChart3, action: () => { setActiveNavItem('reports'); } },
                { id: 'tasks', label: 'Tasks', icon: CheckSquare, action: () => { setActiveNavItem('tasks'); } },
                { id: 'documents', label: 'Documents', icon: FolderOpen, action: () => { setActiveNavItem('documents'); } },
                { id: 'blogs', label: 'Blog Management', icon: FileText, action: () => { setActiveNavItem('blogs'); setBlogEngagementCount(0); }, showNotification: true, notificationCount: blogEngagementCount }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeNavItem === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={item.action || (() => setActiveNavItem(item.id))}
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-[#EDF3FF] text-[#0086CB] shadow-sm' 
                        : 'text-[#181A2A] hover:text-[#0086CB] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                    {item.showNotification && (
                      item.id === 'messages' ? (
                        unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )
                      ) : item.id === 'blogs' ? (
                        blogEngagementCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {blogEngagementCount > 99 ? '99+' : blogEngagementCount}
                          </span>
                        )
                      ) : null
                    )}
                  </button>
                );
              })}
            </nav>
            

          </div>

          <div className="relative group">
            <div className="flex flex-col items-center gap-1 cursor-pointer">
              <div className="w-[30px] h-[30px] bg-gradient-to-br from-[#0076C0] to-[#00C1F4] rounded-2xl flex items-center justify-center text-white font-semibold text-sm">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-[#181A2A] text-sm font-medium">{currentUser?.name || 'User'}</span>
            </div>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#F8F9FA] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <a href="#profile" className="block px-4 py-2 text-sm text-[#181A2A] hover:bg-[#F8F9FA] rounded-lg mx-2">Profile Settings</a>
                <a href="#account" className="block px-4 py-2 text-sm text-[#181A2A] hover:bg-[#F8F9FA] rounded-lg mx-2">Account</a>
                <hr className="my-2 border-[#F8F9FA]" />
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#E6372B] hover:bg-[#FFE3E1] rounded-lg mx-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-4 md:px-8 lg:px-36 pb-16">
        {activeNavItem === 'contacts' && <ContactsPage />}
        {activeNavItem === 'calendar' && <CalendarPage />}
        {activeNavItem === 'reports' && <ReportsPage />}
        {activeNavItem === 'tasks' && <TasksPage />}
        {activeNavItem === 'documents' && <DocumentsPage />}
        {activeNavItem === 'blogs' && <BlogManagement />}
        {activeNavItem === 'messages' && <ChatPage key="lawyer-chat" />}
        
        {activeNavItem === 'home' && (
        <>
        {/* Dashboard Header */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex items-center gap-6 bg-gradient-to-b from-[#0076C0] to-[#00C1F4] rounded-2xl px-6 py-4 shadow-lg">
            <div className="w-8 h-8">
              <svg className="w-full h-full" viewBox="0 0 24 23" fill="none">
                <path d="M11.0032 1.29736L11.3744 6.81731L11.5587 9.59171C11.5607 9.87704 11.6053 10.1605 11.6916 10.4329C11.9141 10.9617 12.4496 11.2977 13.0321 11.2742L21.9084 10.6936C22.2928 10.6873 22.664 10.831 22.9403 11.0933C23.1705 11.3118 23.3192 11.5977 23.3661 11.9052L23.3819 12.0918C23.0145 17.1781 19.2789 21.4205 14.2032 22.5156C9.1274 23.6106 3.92248 21.2973 1.41428 16.8314C0.691184 15.534 0.239531 14.108 0.0858377 12.6369C0.0216377 12.2014 -0.00662902 11.7616 0.00130431 11.3216C-0.00662902 5.86855 3.87662 1.15419 9.31244 0.0176694C9.96668 -0.0842105 10.608 0.262136 10.8704 0.858949C10.9383 0.997163 10.9831 1.14519 11.0032 1.29736Z" fill="white"/>
              </svg>
            </div>
            <span className="text-white text-lg font-semibold">Lawyer Dashboard</span>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-7 mb-6">
          <div className="mb-9">
            <h2 className="text-[#181A2A] text-[17px] font-semibold mb-1">Overview</h2>
            <p className="text-[#737791] text-sm">Current Period Statistics</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#E2F1FF] rounded-xl p-4 relative overflow-hidden">
              <div className="w-[34px] h-[34px] bg-[#007EF4] rounded-full mb-3 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[#03498B] text-xl font-semibold mb-2">Active Cases</h3>
              <p className="text-[#03498B] text-2xl font-bold mb-1">{stats.activeCases || 12}</p>
              <div className="flex items-center text-xs">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-[#737791] ml-1">from last month</span>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#007EF4]/10 rounded-full -mr-8 -mb-8"></div>
            </div>
            <div className="bg-[#DCFCE7] rounded-xl p-4 relative overflow-hidden">
              <div className="w-[34px] h-[34px] bg-[#16D959] rounded-full mb-3 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[#1F5632] text-xl font-semibold mb-2">Total Clients</h3>
              <p className="text-[#1F5632] text-2xl font-bold mb-1">{stats.totalClients || 45}</p>
              <div className="flex items-center text-xs">
                <span className="text-green-600 font-medium">+15%</span>
                <span className="text-[#737791] ml-1">from last month</span>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#16D959]/10 rounded-full -mr-8 -mb-8"></div>
            </div>
            <div className="bg-[#FFE3E1] rounded-xl p-4 relative overflow-hidden">
              <div className="w-[34px] h-[34px] bg-[#E6372B] rounded-full mb-3 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[#931B12] text-xl font-semibold mb-2">Monthly Revenue</h3>
              <p className="text-[#931B12] text-2xl font-bold mb-1">${(stats.monthlyRevenue || 28500).toLocaleString()}</p>
              <div className="flex items-center text-xs">
                <span className="text-green-600 font-medium">+22%</span>
                <span className="text-[#737791] ml-1">from last month</span>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#E6372B]/10 rounded-full -mr-8 -mb-8"></div>
            </div>
            <div className="bg-[#FFF4E0] rounded-xl p-4 relative overflow-hidden">
              <div className="w-[34px] h-[34px] bg-[#F5AB23] rounded-full mb-3 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[#654C1F] text-xl font-semibold mb-2">Upcoming Hearings</h3>
              <p className="text-[#654C1F] text-2xl font-bold mb-1">{stats.upcomingHearings || 7}</p>
              <div className="flex items-center text-xs">
                <span className="text-orange-600 font-medium">3 this week</span>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#F5AB23]/10 rounded-full -mr-8 -mb-8"></div>
            </div>
          </div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-7">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[#181A2A] text-lg font-semibold mb-1">Revenue Overview</h3>
                <p className="text-[#737791] text-sm">Monthly earnings trend</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#007EF4] rounded-full"></div>
                <span className="text-sm text-[#737791]">2024</span>
              </div>
            </div>
            <div className="h-48 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 89, 67, 95, 73, 88, 92, 85, 98].map((height, index) => (
                <div key={index} className="flex-1 bg-gradient-to-t from-[#007EF4] to-[#00C1F4] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer" style={{height: `${height}%`}}></div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-[#737791]">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
          </div>
          
          {/* Case Types Chart */}
          <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-7">
            <div className="mb-6">
              <h3 className="text-[#181A2A] text-lg font-semibold mb-1">Case Distribution</h3>
              <p className="text-[#737791] text-sm">Cases by practice area</p>
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full" style={{background: `conic-gradient(#007EF4 0deg 108deg, #16D959 108deg 180deg, #E6372B 180deg 252deg, #F5AB23 252deg 324deg, #737791 324deg 360deg)`}}></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#181A2A]">{stats.activeCases || 12}</div>
                    <div className="text-xs text-[#737791]">Total</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Civil', count: 5, color: '#007EF4' },
                { label: 'Criminal', count: 3, color: '#16D959' },
                { label: 'Family', count: 2, color: '#E6372B' },
                { label: 'Corporate', count: 1, color: '#F5AB23' },
                { label: 'Other', count: 1, color: '#737791' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                    <span className="text-sm text-[#181A2A]">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-[#737791]">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-7">
            <div className="mb-6">
              <h3 className="text-[#181A2A] text-lg font-semibold mb-1">Quick Actions</h3>
              <p className="text-[#737791] text-sm">Frequently used actions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              <button onClick={() => setShowClientModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <Users className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Client</span>
              </button>
              <button onClick={() => setShowContactModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <UserCheck className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Contact</span>
              </button>
              <button onClick={() => setShowCaseModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <FileText className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Matter</span>
              </button>
              <button onClick={() => setShowEventModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <Calendar className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Event</span>
              </button>
              <button onClick={() => setShowTaskModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <CheckSquare className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Task</span>
              </button>
              <button onClick={() => setShowNoteModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <File className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Note</span>
              </button>
              <button onClick={() => setShowCallModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <Phone className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">Log Call</span>
              </button>
              <button onClick={() => setShowMessageModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <MessageCircle className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">Send Message</span>
              </button>
              <button onClick={() => setShowTimeModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <Clock className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">Track Time</span>
              </button>
              <button onClick={() => setShowExpenseModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <DollarSign className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">Add Expense</span>
              </button>
              <button onClick={() => setShowInvoiceModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <File className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">New Invoice</span>
              </button>
              <button onClick={() => setShowPaymentModal(true)} className="flex flex-col items-center gap-2 p-3 bg-[#F8F9FA] hover:bg-[#E5E7EB] rounded-lg transition-all min-h-[80px] cursor-pointer">
                <CreditCard className="w-5 h-5 text-[#6B7280]" />
                <span className="text-xs font-medium text-center leading-tight text-[#374151]">Record Payment</span>
              </button>
            </div>
          </div>

          {/* Professional Calendar */}
          <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-7">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
              </button>
              <div className="text-center">
                <h2 className="text-[#181A2A] text-lg font-semibold">December 2024</h2>
                <p className="text-[#737791] text-sm">Today: Dec 15, 2024</p>
              </div>
              <button className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="space-y-1">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={i} className="text-center py-2">
                    <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{day}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              {[
                [25, 26, 27, 28, 29, 30, 1],
                [2, 3, 4, 5, 6, 7, 8],
                [9, 10, 11, 12, 13, 14, 15],
                [16, 17, 18, 19, 20, 21, 22],
                [23, 24, 25, 26, 27, 28, 29],
                [30, 31, 1, 2, 3, 4, 5]
              ].map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((date, dateIndex) => {
                    const isToday = date === 15 && weekIndex === 2;
                    const hasEvent = [3, 7, 12, 18, 24].includes(date) && weekIndex >= 1 && weekIndex <= 4;
                    const isPrevNext = (weekIndex === 0 && date > 20) || (weekIndex === 5 && date < 10);
                    
                    return (
                      <div key={dateIndex} className="relative">
                        <button className={`w-full h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:bg-[#F8F9FA] ${
                          isToday 
                            ? 'bg-[#007EF4] text-white shadow-md' 
                            : isPrevNext
                            ? 'text-[#D1D5DB]'
                            : 'text-[#374151] hover:text-[#007EF4]'
                        }`}>
                          {date}
                        </button>
                        {hasEvent && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-1.5 h-1.5 bg-[#16D959] rounded-full"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            
            {/* Upcoming Events */}
            <div className="mt-6 pt-6 border-t border-[#F8F9FA]">
              <h3 className="text-sm font-semibold text-[#374151] mb-3">Upcoming Events</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-2 h-2 bg-[#007EF4] rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#374151]">Client Meeting</p>
                    <p className="text-xs text-[#6B7280]">Dec 18, 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-2 h-2 bg-[#16D959] rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#374151]">Court Hearing</p>
                    <p className="text-xs text-[#6B7280]">Dec 20, 10:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                  <div className="w-2 h-2 bg-[#F5AB23] rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#374151]">Document Review</p>
                    <p className="text-xs text-[#6B7280]">Dec 22, 9:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cases Management */}
        <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#181A2A] text-lg font-semibold">Cases Management</h2>
            <button 
              onClick={() => setShowCaseForm(!showCaseForm)} 
              className="flex items-center gap-2 bg-[#28B779] text-white px-4 py-2 rounded-lg hover:bg-[#229966] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Case
            </button>
          </div>

          {showCaseForm && (
            <div className="mb-6 p-4 border-2 border-[#DCE8FF] rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <input 
                  value={caseTitle}
                  onChange={(e) => setCaseTitle(e.target.value)}
                  placeholder="Case Title" 
                  className="px-4 py-2 border border-[#DCE8FF] rounded-lg" 
                />
                <input 
                  value={caseClient}
                  onChange={(e) => setCaseClient(e.target.value)}
                  placeholder="Client Name (Optional)" 
                  className="px-4 py-2 border border-[#DCE8FF] rounded-lg" 
                />
                <select 
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="px-4 py-2 border border-[#DCE8FF] rounded-lg"
                >
                  <option value="civil">Civil</option>
                  <option value="criminal">Criminal</option>
                  <option value="family">Family</option>
                  <option value="corporate">Corporate</option>
                  <option value="immigration">Immigration</option>
                  <option value="personal_injury">Personal Injury</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={addCase} className="bg-[#28B779] text-white px-4 py-2 rounded-lg hover:bg-[#229966] transition-colors">Save</button>
                <button onClick={() => setShowCaseForm(false)} className="bg-[#F8F9FA] text-[#737791] px-4 py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors">Cancel</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-[#737791]">Loading cases...</p>
            ) : cases.length === 0 ? (
              <p className="text-center text-[#737791]">No cases found. Add your first case!</p>
            ) : (
              cases.map((caseItem) => (
                <div key={caseItem.id} className="flex items-center justify-between p-4 border-2 border-[#DCE8FF] rounded-lg hover:bg-[#F9FAFB] transition-colors">
                  <div>
                    <h3 className="text-[#181A2A] text-base font-semibold">{caseItem.title}</h3>
                    <p className="text-[#737791] text-sm">{caseItem.type} - Filed: {caseItem.filing_date || caseItem.created_at?.split('T')[0]}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColors(caseItem.status)}`}>
                    {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Clients & Invoices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-8">
            <h2 className="text-[#181A2A] text-lg font-semibold mb-4">Recent Clients</h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-[#737791]">Loading...</p>
              ) : clients.length === 0 ? (
                <p className="text-center text-[#737791]">No clients found</p>
              ) : (
                clients.map((client) => (
                  <div key={client.id} className="flex items-center justify-between p-3 border border-[#F8F9FA] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#EDF3FF] rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-[#186898]" />
                      </div>
                      <div>
                        <p className="text-[#181A2A] font-medium">{client.name}</p>
                        <p className="text-[#737791] text-sm">{client.email}</p>
                      </div>
                    </div>
                    <button onClick={() => alert(`View client: ${client.name}`)} className="text-[#0086CB] text-sm font-medium hover:underline cursor-pointer">View</button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-8">
            <h2 className="text-[#181A2A] text-lg font-semibold mb-4">Recent Invoices</h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-[#737791]">Loading...</p>
              ) : invoices.length === 0 ? (
                <p className="text-center text-[#737791]">No invoices found</p>
              ) : (
                invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border border-[#F8F9FA] rounded-lg">
                    <div>
                      <p className="text-[#181A2A] font-medium">INV-{invoice.id}</p>
                      <p className="text-[#737791] text-sm">${(invoice.amount || 0).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getInvoiceStatusColors(invoice.status)}`}>
                      {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1) || 'Unknown'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#333] px-4 md:px-8 lg:px-36 py-12 mt-12">
        <div className="max-w-[1158px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-base font-bold mb-6">Browse Our Site</h3>
              <ul className="space-y-2">
                <li><a href="/lawyers" className="text-[#CCC] text-sm hover:text-white">Find a Lawyer</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Review Your Lawyer</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Legal Advice</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Recently Answered Questions</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Browse Practice Areas</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Avvo Stories Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-base font-bold mb-6">Popular Locations</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">New York City Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Los Angeles Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Chicago Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Houston Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Washington, DC Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Philadelphia Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Phoenix Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">San Antonio Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">San Diego Lawyers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-base font-bold mb-6">Popular Practice Areas</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Bankruptcy & Debt Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Business Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Criminal Defense Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">DUI & DWI Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Estate Planning Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Car Accident Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Divorce & Separation Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Intellectual Property Lawyers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Speeding & Traffic Lawyers</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-base font-bold mb-6">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">About Avvo</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Careers</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Support</a></li>
                <li><a href="#" className="text-[#CCC] text-sm hover:text-white">Avvo Rating Explained</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#CCC]/20 pt-6 flex flex-wrap gap-4 items-center text-sm">
            <a href="#" className="text-[#CCC] hover:text-white pr-4 border-r border-[#CCC]">Terms of Use</a>
            <a href="#" className="text-[#CCC] hover:text-white pr-4 border-r border-[#CCC]">Privacy Policy</a>
            <a href="#" className="text-[#CCC] hover:text-white pr-4 border-r border-[#CCC]">Do Not Sell or Share My Personal Information</a>
            <a href="#" className="text-[#CCC] hover:text-white pr-4 border-r border-[#CCC]">Community Guidelines</a>
            <a href="#" className="text-[#CCC] hover:text-white">Sitemap</a>
          </div>

          <div className="mt-6">
            <p className="text-[#CCC] text-sm">© Avvo Inc. All Rights Reserved 2023</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateClientModal 
        isOpen={showClientModal} 
        onClose={() => setShowClientModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <CreateEventModal 
        isOpen={showEventModal} 
        onClose={() => setShowEventModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <CreateTaskModal 
        isOpen={showTaskModal} 
        onClose={() => setShowTaskModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <CreateContactModal 
        isOpen={showContactModal} 
        onClose={() => setShowContactModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <CreateCaseModal 
        isOpen={showCaseModal} 
        onClose={() => setShowCaseModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <CreateNoteModal 
        isOpen={showNoteModal} 
        onClose={() => setShowNoteModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <LogCallModal 
        isOpen={showCallModal} 
        onClose={() => setShowCallModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <SendMessageModal 
        isOpen={showMessageModal} 
        onClose={() => setShowMessageModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <TrackTimeModal 
        isOpen={showTimeModal} 
        onClose={() => setShowTimeModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <AddExpenseModal 
        isOpen={showExpenseModal} 
        onClose={() => setShowExpenseModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <CreateInvoiceModal 
        isOpen={showInvoiceModal} 
        onClose={() => setShowInvoiceModal(false)} 
        onSuccess={fetchDashboardData}
      />
      <RecordPaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        onSuccess={fetchDashboardData}
      />
    </div>
  );
}