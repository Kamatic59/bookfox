import { formatDistanceToNow } from 'date-fns';
import { Bot, User, AlertCircle } from 'lucide-react';

export default function ConversationList({ conversations, selectedId, onSelect }) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-stone-400">
        <div className="text-4xl mb-3">💬</div>
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs mt-1">New leads will appear here</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-100">
      {conversations.map((convo) => {
        const lastMessage = convo.messages?.[convo.messages.length - 1];
        const isSelected = convo.id === selectedId;
        const isHumanMode = convo.mode === 'human';
        const lead = convo.lead;

        return (
          <button
            key={convo.id}
            onClick={() => onSelect(convo)}
            className={`w-full p-4 text-left hover:bg-stone-50 transition ${
              isSelected ? 'bg-primary-50 border-l-4 border-primary-500' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isHumanMode ? 'bg-amber-100' : 'bg-primary-100'
              }`}>
                {isHumanMode ? (
                  <User className="w-5 h-5 text-amber-600" />
                ) : (
                  <Bot className="w-5 h-5 text-primary-600" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-stone-800 truncate">
                    {lead?.name || convo.customer_phone}
                  </span>
                  <span className="text-xs text-stone-400 flex-shrink-0">
                    {lastMessage && formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: false })}
                  </span>
                </div>

                {/* Service needed */}
                {lead?.service_needed && (
                  <p className="text-xs text-primary-600 truncate mt-0.5">
                    {lead.service_needed}
                  </p>
                )}

                {/* Last message preview */}
                {lastMessage && (
                  <p className="text-sm text-stone-500 truncate mt-1">
                    {lastMessage.direction === 'outbound' && (
                      <span className="text-stone-400">You: </span>
                    )}
                    {lastMessage.content}
                  </p>
                )}

                {/* Indicators */}
                <div className="flex items-center gap-2 mt-2">
                  {isHumanMode && (
                    <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      Human mode
                    </span>
                  )}
                  {lead?.urgency === 'emergency' && (
                    <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      Emergency
                    </span>
                  )}
                  {convo.message_count > 0 && (
                    <span className="text-xs text-stone-400">
                      {convo.message_count} messages
                    </span>
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
