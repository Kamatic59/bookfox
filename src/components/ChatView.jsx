import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, Bot, User, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

function MessageBubble({ message }) {
  const isOutbound = message.direction === 'outbound';
  const isAI = message.sender_type === 'ai';
  const isHuman = message.sender_type === 'human';
  const isCustomer = message.sender_type === 'customer';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOutbound ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOutbound
              ? isAI
                ? 'bg-primary-500 text-white rounded-br-md'
                : 'bg-stone-700 text-white rounded-br-md'
              : 'bg-stone-100 text-stone-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-1.5 mt-1 text-xs text-stone-400 ${
          isOutbound ? 'justify-end' : 'justify-start'
        }`}>
          {isOutbound && (
            <span className="flex items-center gap-1">
              {isAI ? (
                <>
                  <Bot className="w-3 h-3" /> AI
                </>
              ) : (
                <>
                  <User className="w-3 h-3" /> You
                </>
              )}
              •
            </span>
          )}
          <span>{format(new Date(message.created_at), 'h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}

export default function ChatView({ 
  conversation, 
  messages, 
  onSendMessage, 
  onSetMode,
  loading 
}) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(input.trim());
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-stone-400">
        <div className="text-center">
          <div className="text-5xl mb-3">💬</div>
          <p>Select a conversation</p>
        </div>
      </div>
    );
  }

  const isAIMode = conversation.mode === 'ai';
  const lead = conversation.lead;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-stone-800">
              {lead?.name || conversation.customer_phone}
            </h2>
            <p className="text-sm text-stone-500">{conversation.customer_phone}</p>
          </div>
          
          {/* AI/Human Toggle */}
          <button
            onClick={() => onSetMode(isAIMode ? 'human' : 'ai')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              isAIMode
                ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {isAIMode ? (
              <>
                <Bot className="w-4 h-4" />
                AI Responding
                <ToggleRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                Human Mode
                <ToggleLeft className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Lead Info */}
        {lead?.service_needed && (
          <div className="mt-3 p-3 bg-stone-50 rounded-lg">
            <p className="text-xs text-stone-500 uppercase tracking-wide">Service Needed</p>
            <p className="text-sm text-stone-700 mt-0.5">{lead.service_needed}</p>
            {lead.urgency && (
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                lead.urgency === 'emergency' ? 'bg-red-100 text-red-700' :
                lead.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                'bg-stone-100 text-stone-600'
              }`}>
                {lead.urgency} urgency
              </span>
            )}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <p>No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAIMode ? "Type to take over (switches to human mode)" : "Type a message..."}
            className="flex-1 px-4 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        {isAIMode && (
          <p className="text-xs text-stone-400 mt-2 text-center">
            AI is responding automatically. Send a message to take over the conversation.
          </p>
        )}
      </form>
    </div>
  );
}
