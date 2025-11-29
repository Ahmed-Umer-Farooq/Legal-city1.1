import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, MapPin, Users } from 'lucide-react';
import api from '../../utils/api';
import CreateEventModal from '../../components/modals/CreateEventModal';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingEvents = events.filter(event => new Date(event.start_time) >= new Date()).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#181A2A]">Calendar</h1>
          <p className="text-[#737791] mt-1">Manage your schedule and appointments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#28B779] text-white px-4 py-2 rounded-lg hover:bg-[#229966]"
        >
          <Plus className="w-4 h-4" />
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F8F9FA] shadow-md p-6">
          <h2 className="text-lg font-semibold text-[#181A2A] mb-4">Calendar View</h2>
          <div className="bg-[#F8F9FA] rounded-lg p-8 text-center">
            <Calendar className="w-16 h-16 text-[#737791] mx-auto mb-4" />
            <p className="text-[#737791]">Full calendar view coming soon</p>
            <p className="text-sm text-[#737791] mt-2">For now, view your upcoming events in the sidebar</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#F8F9FA] shadow-md">
          <div className="p-6 border-b border-[#F8F9FA]">
            <h2 className="text-lg font-semibold text-[#181A2A]">Upcoming Events</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0086CB] mx-auto"></div>
                <p className="text-[#737791] mt-2">Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-[#737791] mx-auto mb-4" />
                <p className="text-[#737791]">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-[#F8F9FA] rounded-lg p-4">
                    <h3 className="font-semibold text-[#181A2A] mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-[#737791]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.attendees && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-sm text-[#737791] mt-2">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchEvents();
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}