import { useState } from 'react';
import { useConversations, useConversation } from '../hooks/useConversations';
import ConversationList from '../components/ConversationList';
import ChatView from '../components/ChatView';
import { Menu, X, Search, Filter } from 'lucide-react';

export default function Inbox() {
  const { conversations, loading: listLoading } = useConversations();
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all, ai, human

  const {
    conversation,
    messages,
    loading: convoLoading,
    sendMessage,
    setMode,
  } = useConversation(selectedConvoId);

  // Filter conversations
  const filteredConversations = conversations.filter((convo) => {
    // Mode filter
    if (filterMode === 'ai' && convo.mode !== 'ai') return false;
    if (filterMode === 'human' && convo.mode !== 'human') return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesPhone = convo.customer_phone?.toLowerCase().includes(query);
      const matchesName = convo.lead?.name?.toLowerCase().includes(query);
      const matchesService = convo.lead?.service_needed?.toLowerCase().includes(query);
      return matchesPhone || matchesName || matchesService;
    }

    return true;
  });

  function handleSelectConversation(convo) {
    setSelectedConvoId(convo.id);
    setShowSidebar(false);
  }

  async function handleSendMessage(content) {
    // If in AI mode, switch to human mode when sending
    if (conversation?.mode === 'ai') {
      await setMode('human');
    }
    await sendMessage(content);
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden fixed bottom-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg"
      >
        {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Conversation List Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-stone-200
          transform transition-transform lg:transform-none
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200">
          <h1 className="text-xl font-bold text-stone-800">Inbox</h1>
          
          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 mt-3">
            {[
              { id: 'all', label: 'All' },
              { id: 'ai', label: '🤖 AI' },
              { id: 'human', label: '👤 Human' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterMode(filter.id)}
                className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition ${
                  filterMode === filter.id
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto h-[calc(100%-140px)]">
          {listLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-stone-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              selectedId={selectedConvoId}
              onSelect={handleSelectConversation}
            />
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatView
          conversation={conversation}
          messages={messages}
          loading={convoLoading}
          onSendMessage={handleSendMessage}
          onSetMode={setMode}
        />
      </div>

      {/* Mobile overlay */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
}
