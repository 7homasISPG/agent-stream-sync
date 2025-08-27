import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const UserMessage = ({ message }) => {
    const { content, timestamp } = message;
    const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    }) : '';

    return (
        <div className="flex justify-end mb-4">
            <Card className="bg-primary text-primary-foreground border-primary shadow-sm relative max-w-[80%]">
                <CardContent className="p-4 pb-6">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {content?.text}
                    </p>
                    {formattedTime && (
                        <span className="absolute bottom-1 right-2 text-[10px] text-primary-foreground/70">
                            {formattedTime}
                        </span>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UserMessage;