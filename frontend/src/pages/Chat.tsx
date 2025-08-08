import React, { useState, useEffect } from 'react';
import { Send, Clock, LogOut, Hash, Lock } from 'lucide-react';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import ScheduledMessages from '../components/ScheduledMessages';

// Types
interface Channel {
  id: string;
  name: string;
  is_private: boolean;
}

interface ScheduledMessage {
  _id: string;
  channel: string;
  text: string;
  scheduleTime: string;
  sent: boolean;
}

function Chat() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [message, setMessage] = useState('');
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [isScheduleMode, setIsScheduleMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workspaceName, setWorkspaceName] = useState('');

  // Load workspace name and channels on component mount
  useEffect(() => {
    const teamName = Cookies.get('slack_team_name');
    const teamId = Cookies.get('slack_team_id');
    const userId = Cookies.get('slack_user_id');
    
    if (teamName) {
      setWorkspaceName(teamName);
    }

    if (teamId && userId) {
      loadChannels(teamId);
      loadScheduledMessages(teamId, userId);
    } else {
      setLoading(false);
      console.error('No team ID found in cookies');
    }
  }, []);

  // Load channels from API
  const loadChannels = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/slack/channels?teamId=${teamId}`);
      
      if (response.ok) {
        const data = await response.json();
        setChannels(data.channels || []);
        
        // Set first channel as default
        if (data.channels && data.channels.length > 0) {
          setSelectedChannel(data.channels[0].id);
        }
      } else {
        console.error('Failed to load channels:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load scheduled messages from API
  const loadScheduledMessages = async (teamId: string, userId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/slack/chat/get-message`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          userId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const messagesWithChannelNames = data.messages.map((msg: any) => ({
          ...msg,
          channel: channels.find(c => c.id === msg.channel)?.name || msg.channel
        }));
        setScheduledMessages(messagesWithChannelNames);
      } else {
        console.error('Failed to load scheduled messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading scheduled messages:', error);
    }
  };

  // API functions (placeholder implementations)
  const sendInstantMessage = async (channelId: string, messageText: string) => {
    const teamId = Cookies.get('slack_team_id');
    if (!teamId) {
      throw new Error('Team ID not found in cookies');
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/slack/chat/instant-send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamId,
        channel: channelId,
        text: messageText
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  };

  const scheduleMessage = async (channelId: string, messageText: string, scheduledTime: string) => {
    const teamId = Cookies.get('slack_team_id');
    if (!teamId) {
      throw new Error('Team ID not found in cookies');
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/slack/chat/schedule-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamId,
        channel: channelId,
        text: messageText,
        scheduleTime: scheduledTime
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Reload scheduled messages after successful scheduling
    const userId = Cookies.get('slack_user_id');
    if (userId) {
      loadScheduledMessages(teamId, userId);
    }
    
    return data;
  };

  const deleteScheduledMessage = async (messageId: string) => {
    // TODO: Implement delete API when available
    console.log('Deleting scheduled message:', messageId);
    setScheduledMessages(prev => prev.filter(msg => msg._id !== messageId));
    toast.success('Scheduled message deleted successfully!');
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleInstantSend = async () => {
    if (!message.trim() || !selectedChannel) return;
    
    setLoading(true);
    try {
      const result = await sendInstantMessage(selectedChannel, message);
      setMessage('');
      toast.success('Message sent successfully!');
      console.log('Message sent successfully!', result);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSend = async () => {
    if (!message.trim() || !selectedChannel || !scheduleDateTime) return;
    
    setLoading(true);
    try {
      await scheduleMessage(selectedChannel, message, scheduleDateTime);
      setMessage('');
      setScheduleDateTime('');
      setIsScheduleMode(false);
      toast.success('Message scheduled successfully!');
      console.log('Message scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule message:', error);
      toast.error('Failed to schedule message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    // Clear cookies and redirect to home
    Cookies.remove('slack_team_id');
    Cookies.remove('slack_team_name');
    Cookies.remove('slack_bot_user_id');
    Cookies.remove('slack_user_id');
    window.location.href = '/';
  };

  const selectedChannelData = channels.find(c => c.id === selectedChannel);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <span className="ml-4 text-gray-600">Loading channels...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Header */}
        {workspaceName && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome to {workspaceName} Workspace
            </h1>
            <p className="text-gray-600">Send and schedule messages to your team</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Channel Selection and Messaging */}
          <div className="lg:col-span-2 space-y-6">
            {/* Channel Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Channel</h2>
              
              {channels.length === 0 ? (
                <div className="text-center py-8">
                  <Hash className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No channels available</p>
                </div>
              ) : (
                <>
                  {/* Channel Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedChannel}
                      onChange={(e) => setSelectedChannel(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                    >
                      {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                          #{channel.name} {channel.is_private ? '(Private)' : '(Public)'}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {selectedChannelData?.is_private ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Hash className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {selectedChannelData && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      {selectedChannelData.is_private ? (
                        <Lock className="w-4 h-4 mr-1" />
                      ) : (
                        <Hash className="w-4 h-4 mr-1" />
                      )}
                      {selectedChannelData.is_private ? 'Private' : 'Public'} channel: #{selectedChannelData.name}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Message Composition */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h2>
              
              {/* Message Input */}
              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Schedule Mode Toggle */}
              <div className="mb-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={isScheduleMode}
                    onChange={(e) => setIsScheduleMode(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Schedule this message</span>
                </label>
              </div>

              {/* Schedule DateTime Input */}
              {isScheduleMode && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDateTime}
                    onChange={(e) => setScheduleDateTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                {!isScheduleMode ? (
                  <button
                    onClick={handleInstantSend}
                    disabled={!message.trim() || !selectedChannel || loading}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Instantly
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleScheduleSend}
                    disabled={!message.trim() || !selectedChannel || !scheduleDateTime}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Schedule Send
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Disconnect and Scheduled Messages */}
          <div className="space-y-6">
            {/* Disconnect Button */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={handleDisconnect}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Disconnect Workspace
              </button>
            </div>

            {/* Scheduled Messages Component */}
            <ScheduledMessages 
              scheduledMessages={scheduledMessages}
              onDeleteMessage={deleteScheduledMessage}
            />
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Chat;