import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CardSelectionView = ({ payload }) => {
    if (!payload || !Array.isArray(payload)) {
        return <div className="text-sm text-muted-foreground">No card options available</div>;
    }

    const handleCardSelect = (option) => {
        console.log('Card selected:', option);
        // Handle card selection logic here
    };

    return (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {payload.map((option, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            {option.title && (
                                <h4 className="font-medium text-sm">{option.title}</h4>
                            )}
                            {option.description && (
                                <p className="text-xs text-muted-foreground">{option.description}</p>
                            )}
                            {option.value && (
                                <p className="text-sm font-semibold">{option.value}</p>
                            )}
                            <Button 
                                size="sm" 
                                variant="outline" 
                                className="w-full"
                                onClick={() => handleCardSelect(option)}
                            >
                                Select
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default CardSelectionView;