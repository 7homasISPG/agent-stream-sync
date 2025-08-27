import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Send,
  Upload,
  MessageSquare,
  Bot,
  User,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle,
  Zap,
  Wifi,
  WifiOff
} from 'lucide-react';
import axios from 'axios';
import ChatView from './ChatView';

// Configuration
const API_ASK_URL = 'http://localhost:8000/api/ask';
const API_UPLOAD_URL = 'http://localhost:8000/api/upload';
const WS_URL = 'ws://localhost:8000/ws';

const ChatInterface = ({
  startInConversation = false,
  currentThread = null,
  onThreadUpdate = null
}) => {
  // State Management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(startInConversation);
  const [isInteractiveSession, setIsInteractiveSession] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsError, setWsError] = useState(null);

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up WebSocket connection when component unmounts
  useEffect(() => {
    return () => {
      if (ws.current) {
        console.log('🔌 Cleaning up WebSocket connection on unmount');
        ws.current.close();
        ws.current = null;
      }
    };
  }, []);

  // WebSocket connection handler with robust logging
  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log('🔗 WebSocket already connected, skipping reconnection');
      return;
    }

    console.log('🚀 Attempting to connect to WebSocket:', WS_URL);
    setWsError(null);
    
    try {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = (event) => {
        console.log('✅ WebSocket connected successfully', event);
        setWsConnected(true);
        setWsError(null);
        toast({
          title: "Connected",
          description: "Interactive session started",
          duration: 3000,
        });
      };

      ws.current.onmessage = (event) => {
        console.log('📨 WebSocket message received:', event.data);
        setIsTyping(false); // Clear typing indicator when we receive a message
        
        try {
          const parsed = JSON.parse(event.data);
          console.log('📋 Parsed message:', parsed);
          
          if (parsed.type === 'agent_message') {
            // Handle structured agent messages
            const newMessage = {
              role: parsed.sender.toLowerCase(), // supervisor, servicecenteragent, vehicleinfoagent
              content: { text: parsed.text },
              timestamp: Date.now()
            };
            console.log('🤖 Adding agent message:', newMessage);
            setMessages(prev => [...prev, newMessage]);
          } else if (parsed.type === 'final_answer') {
            // Handle final summary
            const finalMessage = {
              role: 'assistant',
              content: { text: parsed.text },
              timestamp: Date.now()
            };
            console.log('🎯 Adding final answer:', finalMessage);
            setMessages(prev => [...prev, finalMessage]);
          } else {
            // Unknown structured format - log warning but show content
            console.warn('⚠️ Unknown message type:', parsed.type, parsed);
            const fallbackMessage = {
              role: 'assistant',
              content: { text: parsed.text || JSON.stringify(parsed) },
              timestamp: Date.now()
            };
            setMessages(prev => [...prev, fallbackMessage]);
          }
        } catch (parseError) {
          // Fallback for plain text messages
          console.log('📝 Treating as plain text message:', event.data);
          const textMessage = {
            role: 'assistant',
            content: { text: event.data },
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, textMessage]);
        }
      };

      ws.current.onclose = (event) => {
        console.log('🔴 WebSocket connection closed:', event.code, event.reason);
        setWsConnected(false);
        setIsInteractiveSession(false);
        setIsTyping(false);
        
        if (event.code !== 1000) { // Not a normal closure
          setWsError(`Connection closed unexpectedly (Code: ${event.code})`);
          toast({
            title: "Connection Lost",
            description: "Interactive session ended",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          console.log('✅ WebSocket closed normally');
          toast({
            title: "Session Ended",
            description: "Interactive session completed",
            duration: 3000,
          });
        }
        ws.current = null;
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setWsError('Connection error occurred');
        setWsConnected(false);
        toast({
          title: "Connection Error",
          description: "Failed to establish connection",
          variant: "destructive",
          duration: 5000,
        });
      };

    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setWsError('Failed to create WebSocket connection');
      toast({
        title: "Connection Failed",
        description: "Could not start interactive session",
        variant: "destructive",
        duration: 5000,
      });
    }
  }, [toast]);

  // File upload handler
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      console.log('📁 Uploading file:', file.name);
      
      const response = await axios.post(API_UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('✅ File upload response:', response.data);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully`,
        duration: 3000,
      });

      // Add file upload confirmation to messages
      const uploadMessage = {
        role: 'system',
        content: { text: `File "${file.name}" uploaded successfully` },
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, uploadMessage]);

    } catch (error) {
      console.error('❌ File upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.detail || "File upload failed",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Main message sending logic
  const handleSendMessage = async (query = input.trim()) => {
    if (!query) return;

    console.log('💬 Sending message:', query, { isInteractiveSession, wsConnected });

    // Add user message to chat immediately
    const userMessage = {
      role: 'user',
      content: { text: query },
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input immediately

    // Handle interactive session (WebSocket mode)
    if (isInteractiveSession && ws.current?.readyState === WebSocket.OPEN) {
      console.log('🌐 Sending via WebSocket:', query);
      setIsTyping(true); // Show typing indicator in WebSocket mode
      try {
        ws.current.send(query);
      } catch (error) {
        console.error('❌ WebSocket send failed:', error);
        setIsTyping(false);
        toast({
          title: "Send Failed",
          description: "Failed to send message via WebSocket",
          variant: "destructive",
          duration: 5000,
        });
      }
      return;
    }

    // Handle HTTP mode
    try {
      setIsLoading(true); // Only block input in HTTP mode
      console.log('🌐 Sending HTTP request to:', API_ASK_URL);

      const response = await axios.post(API_ASK_URL, { query });
      console.log('📥 HTTP response:', response.data);

      // Check if this triggers an interactive session
      if (response.data.type === 'interactive_session_start') {
        console.log('🎬 Interactive session starting, connecting WebSocket...');
        setIsInteractiveSession(true);
        setConversationStarted(true);
        
        // Do NOT add the interactive_session_start signal as a chat bubble
        // Instead, connect WebSocket immediately
        connectWebSocket();
        
        return; // Don't add this as a message
      }

      // Handle regular HTTP response
      const assistantMessage = {
        role: 'assistant',
        content: response.data,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setConversationStarted(true);

    } catch (error) {
      console.error('❌ HTTP request failed:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: { 
          text: `Error: ${error.response?.data?.detail || error.message || 'Request failed'}` 
        },
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Request Failed",
        description: error.response?.data?.detail || "Failed to send message",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Connection status indicator
  const getConnectionStatus = () => {
    if (isInteractiveSession) {
      return wsConnected ? (
        <Badge variant="success" className="gap-1">
          <Wifi className="w-3 h-3" />
          Interactive Mode
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <WifiOff className="w-3 h-3" />
          Connecting...
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <MessageSquare className="w-3 h-3" />
        Standard Mode
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">AI Assistant</h1>
          </div>
          {getConnectionStatus()}
        </div>
        
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.txt,.doc,.docx,.csv,.json"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {wsError && (
        <div className="p-3 bg-destructive/10 border-b border-destructive/20">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{wsError}</span>
          </div>
        </div>
      )}

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        <ChatView
          messages={messages}
          isLoading={isLoading}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
        />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isInteractiveSession 
                  ? "Continue the conversation..." 
                  : "Ask a question..."
              }
              disabled={isLoading}
              className="min-h-[44px] resize-none"
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            size="default"
            className="min-h-[44px] px-6"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Status indicators */}
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {isLoading && !isInteractiveSession && "Processing..."}
            {isTyping && isInteractiveSession && "Agent is typing..."}
            {!isLoading && !isTyping && "Type your message and press Enter"}
          </span>
          
          {messages.length > 0 && (
            <span>{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;