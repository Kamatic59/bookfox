import { formatDistanceToNow } from 'date-fns';
import { Bot, User, AlertCircle } from 'lucide-react';

export default function ConversationList({ conversations, selectedId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[#2E4036]/40">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-sm font-['Outfit']">No conversations yet</p>
        <p className="text-xs mt-1 font-['Outfit']">New leads will appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#2E4036]/5">
      {conversations.map((convo) => {
        const lastMessage = convo.messages?.[convo.messages.length - 1];
        const isSelected = convo.id === selectedId;
        const isHumanMode = convo.mode === 'human';
        const lead = convo.lead;

        return (
          <button
            key={convo.id}
            onClick={() => onSelect(convo)}
            className={`w-full p-4 text-left hover:bg-[#2E4036]/5 transition ${isSelected ? 'bg-[#2E4036]/10 border-l-4 border-[#2E4036]' : ''
              }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isHumanMode ? 'bg-[#CC5833]/10' : 'bg-[#2E4036]/10'
                }`}>
                {isHumanMode ? (
                  <User className="w-5 h-5 text-[#CC5833]" />
                ) : (
                  <Bot className="w-5 h-5 text-[#2E4036]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">
                    {lead?.name || convo.customer_phone}
                  </span>
                  <span className="text-xs text-[#2E4036]/40 flex-shrink-0 font-['IBM_Plex_Mono']">
                    {lastMessage && formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: false })}
                  </span>
                </div>

                {lead?.service_needed && (
                  <p className="text-xs text-[#2E4036] truncate mt-0.5 font-['Outfit']">{lead.service_needed}</p>
                )}

                {lastMessage && (
                  <p className="text-sm text-[#2E4036]/60 truncate mt-1 font-['Outfit']">
                    {lastMessage.direction === 'outbound' && (
                      <span className="text-[#2E4036]/40">You: </span>
                    )}
                    {lastMessage.content}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2">
                  {isHumanMode && (
                    <span className="inline-flex items-center gap-1 text-xs bg-[#CC5833]/10 text-[#CC5833] px-2 py-0.5 rounded-full font-['IBM_Plex_Mono']">
                      <AlertCircle className="w-3 h-3" />
                      Human mode
                    </span>
                  )}
                  {lead?.urgency === 'emergency' && (
                    <span className="inline-flex items-center gap-1 text-xs bg-[#CC5833]/10 text-[#CC5833] px-2 py-0.5 rounded-full font-['IBM_Plex_Mono']">
                      Emergency
                    </span>
                  )}
                  {convo.message_count > 0 && (
                    <span className="text-xs text-[#2E4036]/40 font-['IBM_Plex_Mono']">{convo.message_count} messages</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
