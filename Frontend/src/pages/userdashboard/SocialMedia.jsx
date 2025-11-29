import React, { useState } from 'react';
import { Calendar, Clock, Eye, Heart, MessageCircle, Share2, BarChart3, Users, TrendingUp, Plus, X, Send, Image, Video, Link, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const SocialMedia = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', platform: 'all', scheduledDate: '', scheduledTime: '', attachments: [] });
  const [posts, setPosts] = useState([
    { id: 1, content: 'Just helped another client with their legal consultation. Proud to serve our community! #LegalServices #ClientSuccess', platform: 'all', status: 'published', date: '2024-01-15', likes: 24, comments: 8, shares: 3, userLiked: false },
    { id: 2, content: 'New blog post: Understanding Your Rights in Contract Disputes', platform: 'linkedin', status: 'scheduled', date: '2024-01-16', scheduledTime: '10:00 AM' },
    { id: 3, content: 'Free legal consultation available this Friday. Book your appointment today!', platform: 'facebook', status: 'published', date: '2024-01-14', likes: 18, comments: 12, shares: 6, userLiked: false }
  ]);

  const [platforms, setPlatforms] = useState([
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600', connected: true },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-500', connected: true },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600', connected: false },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', connected: true }
  ]);

  const analytics = {
    totalReach: 12500,
    engagement: 8.5,
    followers: 2340,
    growth: 12.3
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const attachment = { name: file.name, type, file };
      setNewPost({...newPost, attachments: [...newPost.attachments, attachment]});
    }
  };

  const handleAddLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      const attachment = { name: url, type: 'link', url };
      setNewPost({...newPost, attachments: [...newPost.attachments, attachment]});
    }
  };

  const removeAttachment = (index) => {
    const newAttachments = newPost.attachments.filter((_, i) => i !== index);
    setNewPost({...newPost, attachments: newAttachments});
  };

  const togglePlatformConnection = (platformId) => {
    setPlatforms(platforms.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: !platform.connected }
        : platform
    ));
  };

  const handlePostInteraction = (postId, type) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (type === 'like') {
          return {
            ...post,
            likes: post.userLiked ? post.likes - 1 : post.likes + 1,
            userLiked: !post.userLiked
          };
        } else if (type === 'comment') {
          return { ...post, comments: post.comments + 1 };
        } else if (type === 'share') {
          return { ...post, shares: post.shares + 1 };
        }
      }
      return post;
    }));
  };

  const handleCreatePost = () => {
    if (newPost.content.trim()) {
      const post = {
        id: posts.length + 1,
        content: newPost.content,
        platform: newPost.platform,
        status: newPost.scheduledDate ? 'scheduled' : 'published',
        date: newPost.scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime: newPost.scheduledTime,
        attachments: newPost.attachments,
        likes: 0,
        comments: 0,
        shares: 0,
        userLiked: false
      };
      setPosts([post, ...posts]);
      setNewPost({ content: '', platform: 'all', scheduledDate: '', scheduledTime: '', attachments: [] });
      setShowCreateModal(false);
      setShowScheduleModal(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const platformData = platforms.find(p => p.id === platform);
    if (platformData) {
      const Icon = platformData.icon;
      return <Icon className={`w-4 h-4 ${platformData.color}`} />;
    }
    return <Share2 className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Media Management</h1>
          <p className="text-lg text-gray-600">Connect with us on our official social media channels</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Official Social Media</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="https://facebook.com/legalcity" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Facebook</h3>
                  <p className="text-blue-600 font-medium">@legalcity</p>
                </div>
              </div>
            </a>
            
            <a href="https://twitter.com/legalcity" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl border border-sky-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center group-hover:bg-sky-600 transition-colors">
                  <Twitter className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Twitter</h3>
                  <p className="text-sky-600 font-medium">@legalcity</p>
                </div>
              </div>
            </a>
            
            <a href="https://instagram.com/legalcity" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border border-pink-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-700 transition-colors">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Instagram</h3>
                  <p className="text-pink-600 font-medium">@legalcity</p>
                </div>
              </div>
            </a>
            
            <a href="https://linkedin.com/company/legalcity" target="_blank" rel="noopener noreferrer" className="group bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 bg-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-800 transition-colors">
                  <Linkedin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">LinkedIn</h3>
                  <p className="text-blue-700 font-medium">LegalCity</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>






    </div>
  );
};

export default SocialMedia;