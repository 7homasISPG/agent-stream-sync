import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

const SystemMessage = ({ message }) => {
    const { content, timestamp } = message;
    const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    }) : '';

    return (
        <div className="flex justify-center mb-4">
            <Card className="bg-muted/50 border-muted shadow-sm max-w-[60%]">
                <CardContent className="p-3 relative">
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="gap-1">
                            <Info className="w-3 h-3" />
                            System
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {content?.text}
                        </span>
                    </div>
                    
                    {/* Timestamp */}
                    {formattedTime && (
                        <span className="absolute bottom-1 right-2 text-[10px] text-muted-foreground">
                            {formattedTime}
                        </span>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SystemMessage;