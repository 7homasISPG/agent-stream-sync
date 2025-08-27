import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Bot } from 'lucide-react';

const LoadingIndicator = () => {
    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3">
                {/* Bot Avatar */}
                <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        <Bot className="w-4 h-4" />
                    </AvatarFallback>
                </Avatar>

                {/* Loading Content */}
                <Card className="bg-muted border border-border shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Processing your request...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoadingIndicator;