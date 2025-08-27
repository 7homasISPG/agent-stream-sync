import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PricingView = ({ payload }) => {
    if (!payload) {
        return <div className="text-sm text-muted-foreground">No pricing data available</div>;
    }

    const renderPricingItem = (item, index) => (
        <Card key={index} className="w-full">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{item.title || `Option ${index + 1}`}</CardTitle>
                    {item.recommended && (
                        <Badge variant="secondary">Recommended</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {item.price && (
                        <div className="text-lg font-semibold">{item.price}</div>
                    )}
                    {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    {item.features && Array.isArray(item.features) && (
                        <ul className="text-sm space-y-1">
                            {item.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-3">
            {Array.isArray(payload) ? (
                payload.map((item, index) => renderPricingItem(item, index))
            ) : (
                renderPricingItem(payload, 0)
            )}
        </div>
    );
};

export default PricingView;