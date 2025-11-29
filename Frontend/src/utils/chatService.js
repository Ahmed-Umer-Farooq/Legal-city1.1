import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

class ChatService {
  constructor() {
    this.socket = null;
  }

  connect(userData) {
    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to chat server:', this.socket.id);
      this.socket.emit('user_connected', userData);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async getConversations() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/chat/conversations', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }

  async getMessages(partnerId, partnerType) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/chat/messages/${partnerId}/${partnerType}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }

  async getUnreadCount() {
    const token = localStorage.getItem('token');
    const response = await fetch('/api/chat/unread-count', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }

  async markAsRead(partnerId, partnerType) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/chat/messages/read/${partnerId}/${partnerType}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }

  sendMessage(messageData) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', messageData);
      return true;
    }
    return false;
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  onMessageError(callback) {
    if (this.socket) {
      this.socket.on('message_error', callback);
    }
  }

  onUserStatus(callback) {
    if (this.socket) {
      this.socket.on('user_status', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  sendTyping(senderId, receiverId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing', { sender_id: senderId, receiver_id: receiverId });
    }
  }

  stopTyping(senderId, receiverId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('stop_typing', { sender_id: senderId, receiver_id: receiverId });
    }
  }

  onUnreadCountUpdate(callback) {
    if (this.socket) {
      this.socket.on('unread_count_update', callback);
    }
  }

  onRefreshConversations(callback) {
    if (this.socket) {
      this.socket.on('refresh_conversations', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export default new ChatService();