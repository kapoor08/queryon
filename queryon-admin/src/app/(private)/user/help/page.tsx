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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  BookOpen,
  Code,
  MessageSquare,
  Video,
  FileText,
  ExternalLink,
  Star,
  Users,
  Zap,
  Shield,
  Smartphone,
  Globe,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const quickLinks = [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to set up your first chat widget',
      icon: Zap,
      href: '#getting-started',
      time: '5 min read',
    },
    {
      title: 'Widget Customization',
      description: 'Customize colors, position, and behavior',
      icon: BookOpen,
      href: '#customization',
      time: '8 min read',
    },
    {
      title: 'API Documentation',
      description: 'Complete API reference and examples',
      icon: Code,
      href: '#api-docs',
      time: '15 min read',
    },
    {
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: HelpCircle,
      href: '#troubleshooting',
      time: '3 min read',
    },
  ];

  const tutorials = [
    {
      title: 'Setting up your first widget',
      description: 'Step-by-step guide to create and deploy your chat widget',
      duration: '12:34',
      views: '2.1k',
      rating: 4.9,
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
    {
      title: 'Advanced customization techniques',
      description: 'Learn advanced styling and behavior customization',
      duration: '18:45',
      views: '1.8k',
      rating: 4.8,
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
    {
      title: 'Integrating with your CRM',
      description: 'Connect your chat widget with popular CRM systems',
      duration: '15:22',
      views: '1.5k',
      rating: 4.7,
      thumbnail: '/placeholder.svg?height=120&width=200',
    },
  ];

  const faqs = [
    {
      question: 'How do I install the chat widget on my website?',
      answer:
        'Simply copy the embed code from your widget settings and paste it before the closing </body> tag in your HTML. The widget will automatically load and be ready to use.',
    },
    {
      question: 'Can I customize the appearance of the chat widget?',
      answer:
        'Yes! You can customize colors, position, size, welcome messages, and much more through the customization panel in your dashboard.',
    },
    {
      question: 'How many conversations can I handle simultaneously?',
      answer:
        'This depends on your plan. Starter plans support up to 10 concurrent conversations, Pro plans support 100, and Enterprise plans have unlimited concurrent conversations.',
    },
    {
      question: 'Is there a mobile SDK available?',
      answer:
        'Yes, we provide native SDKs for iOS and Android. You can find the documentation and download links in the Mobile SDK section of your dashboard.',
    },
    {
      question: 'How do I train the AI with my own data?',
      answer:
        'You can upload documents, add FAQs, and provide training data through the Model Training section. The AI will automatically learn from your content to provide better responses.',
    },
    {
      question: 'What integrations are available?',
      answer:
        'We support integrations with popular tools like Slack, Zapier, Salesforce, HubSpot, and many more. Check the Integrations hub for the complete list.',
    },
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/widgets',
      description: 'List all widgets',
    },
    {
      method: 'POST',
      endpoint: '/api/v1/widgets',
      description: 'Create a new widget',
    },
    {
      method: 'GET',
      endpoint: '/api/v1/conversations',
      description: 'Get conversation history',
    },
    {
      method: 'POST',
      endpoint: '/api/v1/messages',
      description: 'Send a message',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Help Center
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about ChatWidget. Get started quickly with
          our guides and documentation.
        </p>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((link) => (
          <Card
            key={link.title}
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                  <link.icon className="h-5 w-5 text-purple-600" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {link.time}
                </Badge>
              </div>
              <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {link.description}
              </p>
              <div className="flex items-center text-purple-600 text-sm font-medium">
                Read more <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="guides" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="api">API Docs</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="guides" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span>Getting Started</span>
                </CardTitle>
                <CardDescription>
                  Essential guides to get you up and running
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">Quick Setup Guide</p>
                    <p className="text-sm text-muted-foreground">
                      Get your widget live in 5 minutes
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">Account Setup</p>
                    <p className="text-sm text-muted-foreground">
                      Configure your account settings
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">First Widget</p>
                    <p className="text-sm text-muted-foreground">
                      Create and customize your first widget
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Advanced Features</span>
                </CardTitle>
                <CardDescription>
                  Unlock the full potential of ChatWidget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">AI Training</p>
                    <p className="text-sm text-muted-foreground">
                      Train your AI with custom data
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">Workflow Automation</p>
                    <p className="text-sm text-muted-foreground">
                      Set up automated responses
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">Analytics & Reporting</p>
                    <p className="text-sm text-muted-foreground">
                      Track performance metrics
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5 text-purple-600" />
                  <span>Mobile & Integrations</span>
                </CardTitle>
                <CardDescription>
                  Extend ChatWidget to mobile and other platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">Mobile SDK</p>
                    <p className="text-sm text-muted-foreground">
                      iOS and Android integration
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">CRM Integration</p>
                    <p className="text-sm text-muted-foreground">
                      Connect with Salesforce, HubSpot
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">Webhook Setup</p>
                    <p className="text-sm text-muted-foreground">
                      Real-time event notifications
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  <span>Enterprise</span>
                </CardTitle>
                <CardDescription>
                  Enterprise-grade features and compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">White Label</p>
                    <p className="text-sm text-muted-foreground">
                      Brand the platform as your own
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">GDPR Compliance</p>
                    <p className="text-sm text-muted-foreground">
                      Data privacy and compliance tools
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div>
                    <p className="font-medium">SSO Integration</p>
                    <p className="text-sm text-muted-foreground">
                      Single sign-on setup
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>API Documentation</span>
              </CardTitle>
              <CardDescription>
                Complete API reference for developers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Authentication</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <code className="text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All API requests require authentication using your API key
                    in the Authorization header.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Base URL</h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <code className="text-sm">
                      https://api.chatwidget.com/v1
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All API endpoints are relative to this base URL.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Endpoints</h4>
                <div className="space-y-2">
                  {apiEndpoints.map((endpoint, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            endpoint.method === 'GET' ? 'secondary' : 'default'
                          }
                        >
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.endpoint}</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {endpoint.description}
                        </span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Full API Reference
                </Button>
                <Button variant="outline">
                  <Code className="mr-2 h-4 w-4" />
                  Code Examples
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={tutorial.thumbnail || '/placeholder.svg'}
                    alt={tutorial.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {tutorial.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{tutorial.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{tutorial.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about ChatWidget
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
      </Tabs>

      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground">
                Our support team is here to help you succeed with ChatWidget.
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Live Chat
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
