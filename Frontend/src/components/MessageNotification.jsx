import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import chatService from '../utils/chatService';

const MessageNotification = ({ currentUser, onChatClick }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    // Connect to socket for notifications
    const socket = chatService.connect({ 
      userId: currentUser.id, 
      userType: currentUser.role === 'lawyer' ? 'lawyer' : 'user' 
    });

    // Load initial unread count
    loadUnreadCount();

    // Listen for unread count updates
    chatService.onUnreadCountUpdate(({ count }) => {
      setUnreadCount(count);
    });

    return () => {
      chatService.disconnect();
    };
  }, [currentUser]);

  const loadUnreadCount = async () => {
    try {
      const { count } = await chatService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  return (
    <button
      onClick={onChatClick}
      className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
    >
      <MessageCircle size={24} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default MessageNotification;