import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';
import TypingIndicator from './TypingIndicator';
import { Pencil, Check, X } from 'lucide-react';

const MessageList = ({ messages, isLoading, isTyping, onSendMessage, messagesEndRef }) => {
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState('');

    const handleEditClick = (index, content) => {
        setEditingIndex(index);
        setEditText(content);
    };

    const handleSave = (index) => {
        if (editText.trim()) {
            onSendMessage(editText);
        }
        setEditingIndex(null);
        setEditText('');
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setEditText('');
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    {/* If editing this message */}
                    {editingIndex === index ? (
                        // Edit mode
                        <div className="flex items-center space-x-2 bg-muted p-2 rounded">
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="flex-1 border rounded p-2"
                                autoFocus
                            />
                            <button
                                onClick={() => handleSave(index)}
                                className="text-green-600 hover:text-green-800 p-1"
                            >
                                <Check size={16} />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-red-600 hover:text-red-800 p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        // Normal display mode
                        <div className="relative group">
                            <Message message={msg} onSendMessage={onSendMessage} />
                            
                            {/* Edit button for user messages */}
                            {msg.role === 'user' && (
                                <button
                                    onClick={() => handleEditClick(index, msg.content?.text)}
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border rounded p-1 shadow-sm hover:bg-muted"
                                    title="Edit message"
                                >
                                    <Pencil size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>
            ))}

            {/* Loading indicator for HTTP requests */}
            {isLoading && <LoadingIndicator />}
            
            {/* Typing indicator for WebSocket sessions */}
            {isTyping && <TypingIndicator />}

            {/* Auto-scroll target */}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;