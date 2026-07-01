import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatest?: boolean;
}

export function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} ${
        isLatest ? 'animate-fade-in-up' : ''
      }`}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full bg-mentor-navy flex items-center justify-center text-mentor-cream text-sm font-bold flex-shrink-0 mt-1 mr-3">
          M
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isAssistant
            ? 'bg-mentor-surface border border-mentor-border text-mentor-text rounded-tl-sm'
            : 'bg-mentor-navy text-mentor-cream rounded-tr-sm'
        }`}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-mentor-navy prose-strong:text-mentor-navy prose-code:bg-mentor-cream-dark prose-code:px-1 prose-code:rounded prose-pre:bg-mentor-navy prose-pre:text-mentor-cream prose-a:text-mentor-amber prose-li:my-0.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        )}
      </div>
    </div>
  );
}
