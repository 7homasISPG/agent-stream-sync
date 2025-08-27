import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  Car, 
  Phone,
  Bot 
} from 'lucide-react';

const AgentMessage = ({ message, onSendMessage }) => {
    const { role, content, timestamp } = message;
    
    const getAgentInfo = (agentRole) => {
        switch (agentRole) {
            case 'supervisor':
                return {
                    name: 'Supervisor',
                    icon: Settings,
                    color: 'bg-blue-500',
                    badge: 'supervisor'
                };
            case 'servicecenteragent':
                return {
                    name: 'Service Center',
                    icon: Phone,
                    color: 'bg-green-500',
                    badge: 'service'
                };
            case 'vehicleinfoagent':
                return {
                    name: 'Vehicle Info',
                    icon: Car,
                    color: 'bg-purple-500',
                    badge: 'vehicle'
                };
            default:
                return {
                    name: 'Agent',
                    icon: Bot,
                    color: 'bg-gray-500',
                    badge: 'agent'
                };
        }
    };

    const agentInfo = getAgentInfo(role);
    const IconComponent = agentInfo.icon;
    const formattedTime = timestamp ? new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    }) : '';

    return (
        <div className="flex justify-start mb-4">
            <div className="flex items-start space-x-3 max-w-[80%]">
                {/* Agent Avatar */}
                <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className={`${agentInfo.color} text-white text-xs`}>
                        <IconComponent className="w-4 h-4" />
                    </AvatarFallback>
                </Avatar>

                {/* Message Content */}
                <div className="flex flex-col space-y-1">
                    {/* Agent Name Badge */}
                    <Badge variant="secondary" className="w-fit text-xs">
                        {agentInfo.name}
                    </Badge>
                    
                    {/* Message Card */}
                    <Card className="bg-muted border border-border shadow-sm">
                        <CardContent className="p-4 relative">
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {content?.text || 'No content'}
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
            </div>
        </div>
    );
};

export default AgentMessage;