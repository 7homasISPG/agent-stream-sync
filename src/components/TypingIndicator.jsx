import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';

const TypingIndicator = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3">
                {/* Agent Avatar */}
                <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                        <Bot className="w-4 h-4" />
                    </AvatarFallback>
                </Avatar>

                {/* Typing Animation */}
                <Card className="bg-muted border border-border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-1">
                            <span className="text-sm text-muted-foreground">Agent is typing</span>
                            <div className="flex space-x-1 ml-2">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TypingIndicator;