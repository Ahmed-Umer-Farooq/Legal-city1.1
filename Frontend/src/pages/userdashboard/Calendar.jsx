import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-12-15',
      time: '10:00',
      title: 'Consultation with John Smith',
      type: 'consultation',
      lawyer: 'John Smith'
    },
    {
      id: 2,
      date: '2024-12-18',
      time: '14:30',
      title: 'Document Review',
      type: 'meeting',
      lawyer: 'Sarah Johnson'
    }
  ]);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    time: '',
    type: 'consultation',
    lawyer: ''
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const formatDate = (date, day) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  const getAppointmentsForDate = (date, day) => {
    const dateStr = formatDate(date, day);
    return appointments.filter(apt => apt.date === dateStr);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = formatDate(currentDate, day);
    setSelectedDate(dateStr);
    setShowModal(true);
  };

  const handleAddAppointment = () => {
    if (!newAppointment.title || !newAppointment.time) return;
    
    const appointment = {
      id: Date.now(),
      date: selectedDate,
      ...newAppointment
    };
    
    setAppointments([...appointments, appointment]);
    setNewAppointment({ title: '', time: '', type: 'consultation', lawyer: '' });
    setShowModal(false);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-[#F8F9FA] border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg hover:bg-[#E5E7EB] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md">
        {/* Professional Calendar Header */}
        <div className="flex items-center justify-between p-7 border-b border-[#F8F9FA]">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
          </button>
          <div className="text-center">
            <h2 className="text-[#181A2A] text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-[#737791] text-sm">Today: {new Date().toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-[#F8F9FA] rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Professional Calendar Grid */}
        <div className="p-7">
          <div className="space-y-1">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="text-center py-2">
                  <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{day}</span>
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentDate).map((day, index) => {
                const dayAppointments = day ? getAppointmentsForDate(currentDate, day) : [];
                const todayCheck = isToday(day);
                const isPrevNext = !day;
                
                return (
                  <div key={index} className="relative">
                    <button 
                      onClick={() => handleDateClick(day)}
                      className={`w-full h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:bg-[#F8F9FA] ${
                        todayCheck 
                          ? 'bg-[#007EF4] text-white shadow-md' 
                          : isPrevNext
                          ? 'text-[#D1D5DB] cursor-default'
                          : 'text-[#374151] hover:text-[#007EF4]'
                      }`}
                      disabled={!day}
                    >
                      {day || ''}
                    </button>
                    {dayAppointments.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1.5 h-1.5 bg-[#16D959] rounded-full"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Upcoming Events Section */}
          <div className="mt-6 pt-6 border-t border-[#F8F9FA]">
            <h3 className="text-sm font-semibold text-[#374151] mb-3">Upcoming Appointments</h3>
            <div className="space-y-2">
              {appointments
                .filter(apt => new Date(apt.date) >= new Date().setHours(0,0,0,0))
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3)
                .map(apt => (
                  <div key={apt.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                    <div className="w-2 h-2 bg-[#007EF4] rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#374151]">{apt.title}</p>
                      <p className="text-xs text-[#6B7280]">{new Date(apt.date).toLocaleDateString()}, {apt.time}</p>
                    </div>
                  </div>
                ))
              }
              {appointments.filter(apt => new Date(apt.date) >= new Date().setHours(0,0,0,0)).length === 0 && (
                <p className="text-sm text-[#9CA3AF] italic">No upcoming appointments</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
        <div className="space-y-3">
          {appointments
            .filter(apt => new Date(apt.date) >= new Date().setHours(0,0,0,0))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-3 border border-[#F3F4F6] rounded-lg hover:bg-[#F8F9FA] transition-colors">
                <div className="w-10 h-10 bg-[#F8F9FA] rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#6B7280]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{apt.title}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                  </p>
                  {apt.lawyer && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {apt.lawyer}
                    </p>
                  )}
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-[#F8F9FA] text-[#6B7280] border border-[#E5E7EB]">
                  {apt.type}
                </span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule Appointment
              {selectedDate && (
                <span className="text-sm font-normal text-gray-500 block">
                  {new Date(selectedDate).toLocaleDateString()}
                </span>
              )}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({...newAppointment, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Consultation, Meeting, etc."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lawyer Name
                </label>
                <input
                  type="text"
                  value={newAppointment.lawyer}
                  onChange={(e) => setNewAppointment({...newAppointment, lawyer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Lawyer's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="consultation">Consultation</option>
                  <option value="meeting">Meeting</option>
                  <option value="court">Court Hearing</option>
                  <option value="review">Document Review</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F8F9FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAppointment}
                className="flex-1 px-4 py-2 bg-[#F8F9FA] border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;