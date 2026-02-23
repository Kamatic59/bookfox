import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Send, Bot, User, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

function MessageBubble({ message }) {
  const isOutbound = message.direction === 'outbound';
  const isAI = message.sender_type === 'ai';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOutbound ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl ${isOutbound
              ? isAI
                ? 'bg-[#2E4036] text-[#F2F0E9] rounded-br-md shadow-md shadow-[#2E4036]/20'
                : 'bg-[#CC5833] text-[#F2F0E9] rounded-br-md shadow-md shadow-[#CC5833]/20'
              : 'bg-white border border-[#2E4036]/10 text-[#1A1A1A] rounded-bl-md shadow-sm'
            }`}
        >
          <p className="text-sm whitespace-pre-wrap font-['Outfit']">{message.content}</p>
        </div>
        <div className={`flex items-center gap-1.5 mt-1 text-xs text-[#2E4036]/40 font-['IBM_Plex_Mono'] ${isOutbound ? 'justify-end' : 'justify-start'}`}>
          {isOutbound && (
            <span className="flex items-center gap-1">
              {isAI ? (<><Bot className="w-3 h-3" /> AI</>) : (<><User className="w-3 h-3" /> You</>)}
              •
            </span>
          )}
          <span>{format(new Date(message.created_at), 'h:mm a')}</span>
        </div>
      </div>
    </div>
  );
}

export default function ChatView({ conversation, messages, onSendMessage, onSetMode, loading }) {
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
      <div className="flex-1 flex items-center justify-center text-[#2E4036]/40">
        <div className="text-center">
          <div className="text-5xl mb-3">💬</div>
          <p className="font-['Outfit']">Select a conversation</p>
        </div>
      </div>
    );
  }

  const isAIMode = conversation.mode === 'ai';
  const lead = conversation.lead;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#2E4036]/10 bg-[#F2F0E9]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">{lead?.name || conversation.customer_phone}</h2>
            <p className="text-sm text-[#2E4036]/60 font-['IBM_Plex_Mono']">{conversation.customer_phone}</p>
          </div>
          <button
            onClick={() => onSetMode(isAIMode ? 'human' : 'ai')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition font-['Plus_Jakarta_Sans'] ${isAIMode
                ? 'bg-[#2E4036]/10 text-[#2E4036] hover:bg-[#2E4036]/15'
                : 'bg-[#CC5833]/10 text-[#CC5833] hover:bg-[#CC5833]/15'
              }`}
          >
            {isAIMode ? (<><Bot className="w-4 h-4" />AI Responding<ToggleRight className="w-5 h-5" /></>) : (<><User className="w-4 h-4" />Human Mode<ToggleLeft className="w-5 h-5" /></>)}
          </button>
        </div>

        {lead?.service_needed && (
          <div className="mt-3 p-3 bg-[#2E4036]/5 rounded-xl">
            <p className="text-xs text-[#2E4036]/50 uppercase tracking-wide font-['IBM_Plex_Mono']">Service Needed</p>
            <p className="text-sm text-[#1A1A1A] mt-0.5 font-['Outfit']">{lead.service_needed}</p>
            {lead.urgency && (
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-['IBM_Plex_Mono'] ${lead.urgency === 'emergency' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
                  lead.urgency === 'high' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
                    'bg-[#2E4036]/10 text-[#2E4036]/60'
                }`}>
                {lead.urgency} urgency
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-[#F2F0E9] to-[#F2F0E9]/70">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-[#2E4036] animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-[#2E4036]/40">
            <p className="font-['Outfit']">No messages yet</p>
          </div>
        ) : (
          messages.map((msg) => (<MessageBubble key={msg.id} message={msg} />))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-[#2E4036]/10 bg-[#F2F0E9]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAIMode ? "Type to take over (switches to human mode)" : "Type a message..."}
            className="flex-1 px-4 py-2.5 border border-[#2E4036]/20 rounded-2xl focus:ring-2 focus:ring-[#2E4036]/20 focus:border-[#2E4036]/40 outline-none font-['Outfit']"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="p-2.5 bg-[#2E4036] text-[#F2F0E9] rounded-2xl hover:bg-[#1A1A1A] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-[#2E4036]/20"
          >
            {sending ? (<Loader2 className="w-5 h-5 animate-spin" />) : (<Send className="w-5 h-5" />)}
          </button>
        </div>
        {isAIMode && (
          <p className="text-xs text-[#2E4036]/40 mt-2 text-center font-['Outfit']">
            AI is responding automatically. Send a message to take over the conversation.
          </p>
        )}
      </form>
    </div>
  );
}
