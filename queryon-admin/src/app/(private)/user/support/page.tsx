'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  FileText,
  Video,
  Book,
  Users,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SupportPage() {
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: '',
    description: '',
  });

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      responseTime: '< 2 minutes',
      status: 'online',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: '24/7',
      responseTime: '< 4 hours',
      status: 'available',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri 9AM-6PM PST',
      responseTime: 'Immediate',
      status: 'available',
    },
  ];

  const tickets = [
    {
      id: 'TICK-001',
      subject: 'Widget not loading on mobile',
      status: 'open',
      priority: 'high',
      created: '2 hours ago',
      lastUpdate: '1 hour ago',
    },
    {
      id: 'TICK-002',
      subject: 'API integration question',
      status: 'in-progress',
      priority: 'medium',
      created: '1 day ago',
      lastUpdate: '3 hours ago',
    },
    {
      id: 'TICK-003',
      subject: 'Billing inquiry',
      status: 'resolved',
      priority: 'low',
      created: '3 days ago',
      lastUpdate: '2 days ago',
    },
  ];

  const faqs = [
    {
      question: 'How do I install the chat widget?',
      answer:
        'Simply copy the embed code from your widget settings and paste it before the closing </body> tag in your HTML.',
    },
    {
      question: 'Can I customize the widget appearance?',
      answer:
        'Yes! You can customize colors, position, messages, and much more through the customization panel.',
    },
    {
      question: "What's included in the free trial?",
      answer:
        'The free trial includes all Pro features for 14 days with no limitations or credit card required.',
    },
    {
      question: 'How do I upgrade my plan?',
      answer:
        'You can upgrade your plan anytime from the billing section in your dashboard.',
    },
  ];

  const handleSubmitTicket = () => {
    if (
      !ticketForm.subject ||
      !ticketForm.category ||
      !ticketForm.description
    ) {
      toast('Please fill in all required fields.');
      return;
    }

    toast("We've received your support ticket and will respond soon.");

    setTicketForm({
      subject: '',
      category: '',
      priority: '',
      description: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Open
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            In Progress
          </Badge>
        );
      case 'resolved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground">Get help when you need it most</p>
      </div>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {supportChannels.map((channel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <channel.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{channel.title}</h3>
                      <Badge
                        variant={
                          channel.status === 'online' ? 'default' : 'secondary'
                        }
                        className={
                          channel.status === 'online'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : ''
                        }
                      >
                        {channel.status === 'online' ? 'Online' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {channel.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Availability:
                      </span>
                      <span>{channel.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response:</span>
                      <span>{channel.responseTime}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4">
                    {channel.title === 'Live Chat' && (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    {channel.title === 'Email Support' && (
                      <Mail className="h-4 w-4 mr-2" />
                    )}
                    {channel.title === 'Phone Support' && (
                      <Phone className="h-4 w-4 mr-2" />
                    )}
                    {channel.title === 'Live Chat'
                      ? 'Start Chat'
                      : channel.title === 'Email Support'
                        ? 'Send Email'
                        : 'Call Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>
                Describe your issue and we&apos;ll get back to you as soon as
                possible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={ticketForm.subject}
                    onChange={(e) =>
                      setTicketForm({ ...ticketForm, subject: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={ticketForm.category}
                    onValueChange={(value) =>
                      setTicketForm({ ...ticketForm, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="integration">
                        Integration Help
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={ticketForm.priority}
                  onValueChange={(value) =>
                    setTicketForm({ ...ticketForm, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible about your issue..."
                  rows={6}
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <Button onClick={handleSubmitTicket} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                Track the status of your support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <Badge variant="outline" className="text-xs">
                          {ticket.id}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span>Created {ticket.created}</span>
                        <span>Last update {ticket.lastUpdate}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                    <Book className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">Documentation</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive guides and API documentation
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="h-4 w-4 mr-2" />
                  View Docs
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                    <Video className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold">Video Tutorials</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Step-by-step video guides and walkthroughs
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  <Video className="h-4 w-4 mr-2" />
                  Watch Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold">Community</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect with other users and share experiences
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Need personalized help?
                  </h3>
                  <p className="text-muted-foreground">
                    Schedule a one-on-one session with our experts to get
                    personalized assistance.
                  </p>
                </div>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  Book Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
