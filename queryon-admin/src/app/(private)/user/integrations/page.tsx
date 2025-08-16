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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Plug,
  Plus,
  Settings,
  CheckCircle,
  ExternalLink,
  Copy,
  Trash2,
  Zap,
  Mail,
  MessageSquare,
  Users,
  BarChart3,
  Database,
  Webhook,
} from 'lucide-react';
import { toast } from 'sonner';

export default function IntegrationsPage() {
  const [isWebhookDialogOpen, setIsWebhookDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    name: '',
    url: '',
    events: [] as string[],
  });

  const integrations = [
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and chat messages to Slack channels',
      category: 'Communication',
      status: 'connected',
      icon: '💬',
      color: 'bg-purple-100 text-purple-800',
      features: ['Real-time notifications', 'Channel routing', 'Bot responses'],
      setupUrl: '/integrations/slack',
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Sync leads and customer data with Salesforce CRM',
      category: 'CRM',
      status: 'available',
      icon: '☁️',
      color: 'bg-blue-100 text-blue-800',
      features: ['Lead sync', 'Contact management', 'Opportunity tracking'],
      setupUrl: '/integrations/salesforce',
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      description: 'Connect with HubSpot for marketing and sales automation',
      category: 'CRM',
      status: 'connected',
      icon: '🧡',
      color: 'bg-orange-100 text-orange-800',
      features: ['Contact sync', 'Deal tracking', 'Email sequences'],
      setupUrl: '/integrations/hubspot',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 5000+ apps through Zapier automation',
      category: 'Automation',
      status: 'available',
      icon: '⚡',
      color: 'bg-yellow-100 text-yellow-800',
      features: [
        '5000+ app connections',
        'Custom workflows',
        'Trigger actions',
      ],
      setupUrl: '/integrations/zapier',
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track chat widget performance and user interactions',
      category: 'Analytics',
      status: 'connected',
      icon: '📊',
      color: 'bg-green-100 text-green-800',
      features: ['Event tracking', 'Conversion goals', 'Custom dimensions'],
      setupUrl: '/integrations/google-analytics',
    },
    {
      id: 'intercom',
      name: 'Intercom',
      description: 'Migrate conversations and customer data from Intercom',
      category: 'Migration',
      status: 'available',
      icon: '💼',
      color: 'bg-indigo-100 text-indigo-800',
      features: ['Data migration', 'Conversation history', 'User profiles'],
      setupUrl: '/integrations/intercom',
    },
    {
      id: 'zendesk',
      name: 'Zendesk',
      description: 'Create support tickets from chat conversations',
      category: 'Support',
      status: 'available',
      icon: '🎫',
      color: 'bg-pink-100 text-pink-800',
      features: ['Ticket creation', 'Agent assignment', 'Priority routing'],
      setupUrl: '/integrations/zendesk',
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Send notifications to Microsoft Teams channels',
      category: 'Communication',
      status: 'coming-soon',
      icon: '👥',
      color: 'bg-blue-100 text-blue-800',
      features: ['Team notifications', 'Channel routing', 'Bot integration'],
      setupUrl: '/integrations/microsoft-teams',
    },
  ];

  const webhooks = [
    {
      id: 1,
      name: 'Lead Notification',
      url: 'https://api.mycompany.com/webhooks/leads',
      events: ['lead.created', 'lead.qualified'],
      status: 'active',
      lastTriggered: '2 minutes ago',
    },
    {
      id: 2,
      name: 'Conversation Updates',
      url: 'https://hooks.zapier.com/hooks/catch/********/********',
      events: ['conversation.started', 'conversation.ended'],
      status: 'active',
      lastTriggered: '5 minutes ago',
    },
    {
      id: 3,
      name: 'Support Tickets',
      url: 'https://api.zendesk.com/webhooks/tickets',
      events: ['message.received'],
      status: 'inactive',
      lastTriggered: '2 days ago',
    },
  ];

  const availableEvents = [
    'conversation.started',
    'conversation.ended',
    'message.received',
    'message.sent',
    'lead.created',
    'lead.qualified',
    'widget.loaded',
    'user.identified',
  ];

  const handleCreateWebhook = () => {
    toast(`${newWebhook.name} has been created successfully.`);
    setIsWebhookDialogOpen(false);
    setNewWebhook({
      name: '',
      url: '',
      events: [],
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        );
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>;
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Communication':
        return <MessageSquare className="h-4 w-4" />;
      case 'CRM':
        return <Users className="h-4 w-4" />;
      case 'Analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'Automation':
        return <Zap className="h-4 w-4" />;
      case 'Support':
        return <Mail className="h-4 w-4" />;
      case 'Migration':
        return <Database className="h-4 w-4" />;
      default:
        return <Plug className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <p className="text-muted-foreground">
            Connect ChatWidget with your favorite tools and services
          </p>
        </div>
        <Dialog
          open={isWebhookDialogOpen}
          onOpenChange={setIsWebhookDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>
                Set up a webhook to receive real-time notifications about events
                in your chat widget.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g., Lead Notifications"
                  value={newWebhook.name}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://api.yourapp.com/webhooks"
                  value={newWebhook.url}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Events</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableEvents.map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={event}
                        checked={newWebhook.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({
                              ...newWebhook,
                              events: [...newWebhook.events, event],
                            });
                          } else {
                            setNewWebhook({
                              ...newWebhook,
                              events: newWebhook.events.filter(
                                (e) => e !== event
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={event} className="text-sm">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsWebhookDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook}>Create Webhook</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Plug className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Ready to connect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active webhooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Today</CardTitle>
            <Zap className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">Webhook triggers</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="integrations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="integrations">All Integrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => (
              <Card
                key={integration.id}
                className="hover:shadow-lg transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{integration.icon}</div>
                      <div>
                        <CardTitle className="text-lg">
                          {integration.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          {getCategoryIcon(integration.category)}
                          <span className="text-sm text-muted-foreground">
                            {integration.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(integration.status)}
                  </div>
                  <CardDescription className="mt-2">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="space-y-1">
                        {integration.features.map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-center"
                          >
                            <CheckCircle className="h-3 w-3 mr-2 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </>
                      ) : integration.status === 'available' ? (
                        <Button size="sm" className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Endpoints</CardTitle>
              <CardDescription>
                Manage your webhook endpoints for real-time event notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <Webhook className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{webhook.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {webhook.url}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Events:
                          </span>
                          {webhook.events.map((event, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(webhook.status)}
                      <span className="text-xs text-muted-foreground">
                        Last: {webhook.lastTriggered}
                      </span>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for custom integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Production API Key</h3>
                    <p className="text-sm text-muted-foreground">
                      sk_live_••••••••••••••••••••••••••••••••
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created on Jan 15, 2024
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Test API Key</h3>
                    <p className="text-sm text-muted-foreground">
                      sk_test_••••••••••••••••••••••••••••••••
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created on Jan 10, 2024
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Test</Badge>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Generate New API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
