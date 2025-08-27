import React from 'react';
import MessageList from './MessageList';

const ChatView = ({ messages, isLoading, isTyping, onSendMessage, messagesEndRef }) => {
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <MessageList
                messages={messages}
                isLoading={isLoading}
                isTyping={isTyping}
                onSendMessage={onSendMessage}
                messagesEndRef={messagesEndRef}
            />
        </div>
    );
};

export default ChatView;