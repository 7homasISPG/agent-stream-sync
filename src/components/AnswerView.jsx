import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AnswerView = ({ payload }) => {
    if (!payload) {
        return <div className="text-sm text-muted-foreground">No answer data available</div>;
    }

    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="space-y-2">
                    {typeof payload === 'string' ? (
                        <p className="text-sm leading-relaxed">{payload}</p>
                    ) : payload.text ? (
                        <p className="text-sm leading-relaxed">{payload.text}</p>
                    ) : (
                        <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                            {JSON.stringify(payload, null, 2)}
                        </pre>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AnswerView;