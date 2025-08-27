import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import TableView from './TableView';
import AnswerView from './AnswerView';
import CardSelectionView from './CardSelectionView';
import PricingView from './PricingView';

const AssistantMessage = ({ message, onSendMessage }) => {
    const { content, timestamp } = message;
    const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    }) : '';

    const renderMessageContent = () => {
        switch (content?.type) {
            case 'table': {
                console.log("TableData:", content.data);
                const rawData = content.data;

                const headers = Array.from(
                    new Set(rawData.flatMap(obj => Object.keys(obj).filter(key => key !== 'Source')))
                );

                const rows = rawData.map(obj =>
                    headers.map(header => obj[header] || '')
                );

                const citations = rawData
                    .flatMap(obj => obj["Source"]?.split(',') || [])
                    .map(src => src.trim())
                    .filter(Boolean)
                    .map(url => ({ url }));

                if (citations.length > 0 && typeof onSendMessage === 'function') {
                    onSendMessage({ type: '__setSources', data: citations });
                }

                return <TableView data={{ headers, rows }} />;
            }
            case 'pricing':
                return <PricingView payload={content.data} />;
            case 'card_selection':
                return (
                    <div className="p-2">
                        <p className="px-4 pt-2 mb-2 text-sm text-muted-foreground">
                            {content.description}
                        </p>
                        <CardSelectionView payload={content.data} />
                    </div>
                );
            case 'answer':
                return <AnswerView payload={content.data} />;
            default:
                // Handle plain text and other content types
                return (
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {content?.text || JSON.stringify(content)}
                    </div>
                );
        }
    };

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-[80%]">
                {/* Assistant Avatar */}
                <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        <Bot className="w-4 h-4" />
                    </AvatarFallback>
                </Avatar>

                {/* Message Content */}
                <Card className="bg-card border border-border shadow-sm">
                    <CardContent className="p-4 relative">
                        {renderMessageContent()}
                        
                        {/* Timestamp */}
                        {formattedTime && (
                            <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
                                {formattedTime}
                            </span>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AssistantMessage;