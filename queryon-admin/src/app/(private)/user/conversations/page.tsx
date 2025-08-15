'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  Bot,
  Star,
  Archive,
  Download,
  Tag,
  Globe,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react';

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        avatar: '/placeholder.svg?height=32&width=32',
      },
      widget: 'Main Website',
      status: 'active',
      priority: 'high',
      lastMessage: 'Thank you for the quick response!',
      lastMessageTime: '2 min ago',
      messageCount: 12,
      satisfaction: 5,
      tags: ['billing', 'urgent'],
      assignedTo: 'John Doe',
    },
    {
      id: 2,
      customer: {
        name: 'Mike Chen',
        email: 'mike@techcorp.com',
        avatar: '/placeholder.svg?height=32&width=32',
      },
      widget: 'Support Portal',
      status: 'waiting',
      priority: 'medium',
      lastMessage: 'I need help with the API integration',
      lastMessageTime: '15 min ago',
      messageCount: 8,
      satisfaction: null,
      tags: ['api', 'technical'],
      assignedTo: 'Sarah Wilson',
    },
    {
      id: 3,
      customer: {
        name: 'Emma Davis',
        email: 'emma@startup.io',
        avatar: '/placeholder.svg?height=32&width=32',
      },
      widget: 'Landing Page',
      status: 'resolved',
      priority: 'low',
      lastMessage: 'Perfect, that solved my issue!',
      lastMessageTime: '1 hour ago',
      messageCount: 5,
      satisfaction: 4,
      tags: ['general'],
      assignedTo: 'Mike Johnson',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'customer',
      content: "Hi, I'm having trouble with my billing. Can you help?",
      timestamp: '10:30 AM',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 2,
      sender: 'agent',
      content:
        "Hello Sarah! I'd be happy to help you with your billing question. Can you tell me more about the specific issue you're experiencing?",
      timestamp: '10:32 AM',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 3,
      sender: 'customer',
      content:
        'I was charged twice for my subscription this month. I can see two charges on my credit card statement.',
      timestamp: '10:35 AM',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 4,
      sender: 'agent',
      content:
        "I apologize for the confusion. Let me check your account right away. I can see there was indeed a duplicate charge. I'll process a refund for the extra charge immediately.",
      timestamp: '10:37 AM',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    {
      id: 5,
      sender: 'customer',
      content: 'Thank you for the quick response!',
      timestamp: '10:40 AM',
      avatar: '/placeholder.svg?height=32&width=32',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'waiting':
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          >
            <Clock className="h-3 w-3 mr-1" />
            Waiting
          </Badge>
        );
      case 'resolved':
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Conversations</h2>
          <p className="text-muted-foreground">
            Manage and respond to customer conversations
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Select defaultValue="all">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-muted/50 border-l-4 ${
                      selectedConversation === conversation.id
                        ? 'bg-muted/50 border-l-purple-600'
                        : 'border-l-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={
                            conversation.customer.avatar || '/placeholder.svg'
                          }
                          alt={conversation.customer.name}
                        />
                        <AvatarFallback>
                          {conversation.customer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">
                            {conversation.customer.name}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusBadge(conversation.status)}
                          {getPriorityBadge(conversation.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {conversation.widget}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {conversation.messageCount}
                            </span>
                          </div>
                        </div>
                        {conversation.satisfaction && (
                          <div className="flex items-center space-x-1 mt-2">
                            {renderStars(conversation.satisfaction)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.customer.avatar ||
                          '/placeholder.svg' ||
                          '/placeholder.svg'
                        }
                        alt={
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.customer.name
                        }
                      />
                      <AvatarFallback>
                        {conversations
                          .find((c) => c.id === selectedConversation)
                          ?.customer.name.split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.customer.name
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.customer.email
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Tag className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.sender === 'customer'
                              ? 'flex-row'
                              : 'flex-row-reverse space-x-reverse'
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={message.avatar || '/placeholder.svg'}
                              alt="Avatar"
                            />
                            <AvatarFallback>
                              {message.sender === 'customer' ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 ${
                              message.sender === 'customer'
                                ? 'bg-muted'
                                : 'bg-purple-600 text-white dark:bg-purple-700'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender === 'customer'
                                  ? 'text-muted-foreground'
                                  : 'text-purple-100'
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button>Send</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Select a conversation
                </h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to view messages
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
