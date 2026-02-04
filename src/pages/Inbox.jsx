import { useState, useEffect, useRef } from 'react';
import { useConversations } from '../hooks/useConversations';

// Format time helper
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString();
}

// Conversation list item
function ConversationItem({ conversation, selected, onClick }) {
  const lastMessage = conversation.messages?.[0];
  const isUnread = conversation.status === 'active' && lastMessage?.direction === 'inbound';
  
  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-all duration-200 active:bg-stone-100 ${
        selected 
          ? 'bg-blue-50 border-l-4 border-blue-500' 
          : 'hover:bg-stone-50 border-l-4 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            conversation.mode === 'ai' 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/20' 
              : 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/20'
          }`}>
            {(conversation.lead?.name || conversation.customer_phone || '?').charAt(0).toUpperCase()}
          </div>
          {isUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`font-medium truncate ${isUnread ? 'text-stone-900' : 'text-stone-700'}`}>
              {conversation.lead?.name || conversation.customer_phone || 'Unknown'}
            </p>
            <span className="text-xs text-stone-400 whitespace-nowrap flex-shrink-0">
              {lastMessage ? formatTime(lastMessage.created_at) : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {conversation.mode === 'ai' && (
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold flex-shrink-0">
                AI
              </span>
            )}
            <p className={`text-sm truncate ${isUnread ? 'text-stone-700 font-medium' : 'text-stone-500'}`}>
              {lastMessage?.content || 'No messages yet'}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

// Message bubble
function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
      <div className={`max-w-[85%] sm:max-w-[75%]`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isOwn 
            ? message.sender_type === 'ai'
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg shadow-blue-500/20'
              : 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-md shadow-lg shadow-emerald-500/20'
            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-md shadow-sm'
        }`}>
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{message.content}</p>
        </div>
        <div className={`flex items-center gap-2 mt-1.5 text-xs text-stone-400 ${isOwn ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
          {isOwn && message.sender_type === 'ai' && (
            <span className="flex items-center gap-1">
              <span>🤖</span>
              <span>AI</span>
            </span>
          )}
          <span>{formatTime(message.created_at)}</span>
        </div>
      </div>
    </div>
  );
}

// Empty state
function EmptyInbox() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm animate-fade-in-up">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="text-xl font-bold text-stone-800 mb-2">No conversations yet</h3>
        <p className="text-stone-500">
          When customers text your BookFox number, their conversations will appear here.
        </p>
      </div>
    </div>
  );
}

// Mobile: No conversation selected
function MobileConversationList({ conversations, selectedId, onSelect, searchQuery, setSearchQuery, filter, setFilter }) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-white sticky top-0 z-10">
        <h2 className="text-xl font-bold text-stone-800 mb-4">Inbox</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-stone-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'ai', label: '🤖 AI' },
            { value: 'human', label: '👤 Human' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === f.value
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-stone-500 hover:bg-stone-100 active:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <EmptyInbox />
        ) : (
          <div className="divide-y divide-stone-100">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                selected={selectedId === conversation.id}
                onClick={() => onSelect(conversation.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Chat view
function ChatView({ conversation, messages, onBack, onSend, newMessage, setNewMessage, sending }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors lg:hidden"
          >
            <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
          conversation.mode === 'ai'
            ? 'bg-gradient-to-br from-blue-400 to-blue-600'
            : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
        }`}>
          {(conversation.lead?.name || conversation.customer_phone || '?').charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-800 truncate">
            {conversation.lead?.name || conversation.customer_phone || 'Unknown'}
          </h3>
          <p className="text-stone-500 text-xs flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${conversation.mode === 'ai' ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
            {conversation.mode === 'ai' ? 'AI Mode' : 'Human Mode'}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors" title="Call">
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 rounded-xl hover:bg-stone-100 active:bg-stone-200 transition-colors" title="More">
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 scroll-smooth">
        {messages?.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-stone-400">No messages yet</p>
          </div>
        ) : (
          <>
            {messages?.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.direction === 'outbound'}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-stone-200 p-4 safe-area-bottom">
        <form onSubmit={onSend} className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-stone-100 border border-transparent rounded-2xl resize-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-[16px]"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSend(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 flex-shrink-0"
          >
            {sending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        
        {conversation.mode === 'ai' && (
          <p className="text-xs text-stone-400 mt-2 text-center">
            💡 Sending a message will switch to Human mode
          </p>
        )}
      </div>
    </div>
  );
}

export default function Inbox() {
  const { conversations, loading, selectConversation, selectedConversation, messages } = useConversations();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Filter conversations
  const filteredConversations = conversations?.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.customer_phone?.includes(searchQuery) ||
      c.lead?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || c.mode === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  const handleSelectConversation = (id) => {
    selectConversation(id);
    setMobileShowChat(true);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    setSending(true);
    try {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4 animate-bounce-soft">🦊</div>
          <p className="text-stone-500">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem-5rem)] lg:h-[calc(100vh-4rem)] flex">
      {/* Desktop: Two column layout */}
      {/* Mobile: Show list or chat */}
      
      {/* Conversation List */}
      <div className={`w-full lg:w-96 border-r border-stone-200 bg-white flex-shrink-0 ${
        mobileShowChat ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'
      }`}>
        <MobileConversationList
          conversations={filteredConversations}
          selectedId={selectedConversation?.id}
          onSelect={handleSelectConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${
        !mobileShowChat ? 'hidden lg:flex' : 'flex'
      }`}>
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            <ChatView
              conversation={selectedConversation}
              messages={messages}
              onBack={() => setMobileShowChat(false)}
              onSend={handleSendMessage}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              sending={sending}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-stone-50">
            <div className="text-center animate-fade-in">
              <div className="text-5xl mb-4">👈</div>
              <h3 className="text-lg font-medium text-stone-800">Select a conversation</h3>
              <p className="text-stone-500 mt-1">Choose from the list to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
