import { Clock, Trash2, Hash} from 'lucide-react';

interface ScheduledMessage {
  id: string;
  channel: string;
  message: string;
  scheduledTime: string;
  status: 'pending' | 'sent' | 'failed';
}

interface ScheduledMessagesProps {
  scheduledMessages: ScheduledMessage[];
  onDeleteMessage: (messageId: string) => void;
}

function ScheduledMessages({ scheduledMessages, onDeleteMessage }: ScheduledMessagesProps) {
  const formatScheduledTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Scheduled Messages ({scheduledMessages.length})
      </h2>
      
      {scheduledMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No scheduled messages</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {scheduledMessages.map((msg) => (
            <div
              key={msg.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">#{msg.channel}</span>
                </div>
                <button
                  onClick={() => onDeleteMessage(msg.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700 text-sm mb-2 line-clamp-2">{msg.message}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatScheduledTime(msg.scheduledTime)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduledMessages;