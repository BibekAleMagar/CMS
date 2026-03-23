import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/src/components/ui/button';
import { Send, User } from 'lucide-react';
import {
  initiateSocketConnection,
  disconnectSocket,
  subscribeToCaseMessages,
  unsubscribeFromCaseMessages,
  sendMessageToCaseSocket,
} from '@/src/lib/socket';
import api from '@/src/lib/api';

interface Message {
  id: number;
  caseId: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: number;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

interface CaseChatProps {
  caseId: number;
  currentUser: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  lawyerId?: number;
  clientId: number;
}

export default function CaseChat({ caseId, currentUser, lawyerId, clientId }: CaseChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine the receiver (if current user is client, receiver is lawyer, and vice versa)
  const receiverId = currentUser.id === clientId ? lawyerId : clientId;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let active = true;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/message/case/${caseId}`);
        if (active) {
          setMessages(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch messages', error);
        setLoading(false);
      }
    };

    fetchMessages();

    // Setup Socket
    initiateSocketConnection();
    subscribeToCaseMessages(caseId, currentUser.id, (message: Message) => {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.find((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    return () => {
      active = false;
      unsubscribeFromCaseMessages(caseId, currentUser.id);
      disconnectSocket();
    };
  }, [caseId, currentUser.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !receiverId) return;

    sendMessageToCaseSocket(caseId, receiverId, newMessage, currentUser);
    setNewMessage('');
  };

  if (loading) {
    return <div className="p-4 text-center">Loading chat...</div>;
  }

  // If Lawyer hasn't been assigned, no chat available
  if (!lawyerId) {
    return (
      <div className="p-4 text-center text-gray-500 italic">
        A lawyer has not been assigned to this case yet. Chat is disabled.
      </div>
    );
  }

  // If the user isn't part of the chat (e.g. Super Admin), just indicate it or make it read-only
  const isParticipant = currentUser.id === clientId || currentUser.id === lawyerId;

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-white overflow-hidden shadow-sm">
      <div className="bg-primary text-primary-foreground p-3 shadow text-sm font-semibold flex items-center justify-between">
        <span>Case Discussion</span>
        {!isParticipant && <span className="text-xs bg-red-500/20 text-red-500 px-2 rounded">Read Only</span>}
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10 text-sm">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-end gap-2 max-w-[80%]">
                  {!isMe && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border rounded-bl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-10">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  • {msg.sender.firstName}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {isParticipant && (
        <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()} className="rounded-full shrink-0 w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            <Send className="w-4 h-4 ml-1" />
          </Button>
        </form>
      )}
    </div>
  );
}
