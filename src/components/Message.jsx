import React from 'react';
import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';
import SystemMessage from './SystemMessage';
import AgentMessage from './AgentMessage';

const Message = ({ message, onSendMessage }) => {
    const { role } = message;

    // Handle different agent roles with specific styling
    if (['supervisor', 'servicecenteragent', 'vehicleinfoagent'].includes(role)) {
        return <AgentMessage message={message} onSendMessage={onSendMessage} />;
    }

    if (role === 'user') {
        return <UserMessage message={message} />;
    }

    if (role === 'assistant') {
        return <AssistantMessage message={message} onSendMessage={onSendMessage} />;
    }

    if (role === 'system') {
        return <SystemMessage message={message} />;
    }

    return null;
};

export default Message;