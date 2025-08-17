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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Bot,
  Plus,
  Settings,
  Copy,
  Globe,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Palette,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WidgetsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWidget, setNewWidget] = useState({
    name: '',
    domain: '',
    position: 'bottom-right',
    primaryColor: '#3b82f6',
    welcomeMessage: 'Hi! How can I help you today?',
    enabled: true,
  });

  const widgets = [
    {
      id: 1,
      name: 'Main Website Widget',
      domain: 'mywebsite.com',
      status: 'active',
      queries: 850,
      lastActive: '2 hours ago',
      responseTime: '1.2s',
      satisfaction: 4.8,
      position: 'bottom-right',
      primaryColor: '#3b82f6',
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Support Portal Widget',
      domain: 'support.mywebsite.com',
      status: 'active',
      queries: 400,
      lastActive: '5 minutes ago',
      responseTime: '0.9s',
      satisfaction: 4.9,
      position: 'bottom-left',
      primaryColor: '#10b981',
      createdAt: '2024-01-10',
    },
    {
      id: 3,
      name: 'Landing Page Widget',
      domain: 'landing.mywebsite.com',
      status: 'inactive',
      queries: 0,
      lastActive: 'Never',
      responseTime: '-',
      satisfaction: 0,
      position: 'bottom-right',
      primaryColor: '#f59e0b',
      createdAt: '2024-01-08',
    },
  ];

  const handleCreateWidget = () => {
    toast(`${newWidget.name} has been created and is ready to deploy.`);
    setIsCreateDialogOpen(false);
    setNewWidget({
      name: '',
      domain: '',
      position: 'bottom-right',
      primaryColor: '#3b82f6',
      welcomeMessage: 'Hi! How can I help you today?',
      enabled: true,
    });
  };

  const copyEmbedCode = (widgetId: number) => {
    const embedCode = `<script src="https://your-chat-widget.vercel.app/widget.js" data-widget-id="${widgetId}"></script>`;
    navigator.clipboard.writeText(embedCode);
    toast('The embed code has been copied to your clipboard.');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Widgets</h2>
          <p className="text-muted-foreground">
            Manage your chat widgets and their configurations
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Widget
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Widget</DialogTitle>
              <DialogDescription>
                Configure your new chat widget. You can customize it further
                after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Widget Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Website"
                    value={newWidget.name}
                    onChange={(e) =>
                      setNewWidget({ ...newWidget, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={newWidget.domain}
                    onChange={(e) =>
                      setNewWidget({ ...newWidget, domain: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={newWidget.position}
                    onValueChange={(value) =>
                      setNewWidget({ ...newWidget, position: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Primary Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={newWidget.primaryColor}
                    onChange={(e) =>
                      setNewWidget({
                        ...newWidget,
                        primaryColor: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="welcome">Welcome Message</Label>
                <Textarea
                  id="welcome"
                  placeholder="Enter your welcome message"
                  value={newWidget.welcomeMessage}
                  onChange={(e) =>
                    setNewWidget({
                      ...newWidget,
                      welcomeMessage: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newWidget.enabled}
                  onCheckedChange={(checked) =>
                    setNewWidget({ ...newWidget, enabled: checked })
                  }
                />
                <Label htmlFor="enabled">Enable widget immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWidget}>Create Widget</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {widgets.map((widget) => (
          <Card key={widget.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Bot className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{widget.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {widget.domain}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(widget.status)}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="embed">Embed</TabsTrigger>
                  <TabsTrigger value="customize">Customize</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <MessageSquare className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Queries</p>
                      <p className="font-semibold">
                        {widget.queries.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <p className="text-sm text-muted-foreground">
                        Response Time
                      </p>
                      <p className="font-semibold">{widget.responseTime}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <p className="text-sm text-muted-foreground">
                        Satisfaction
                      </p>
                      <p className="font-semibold">{widget.satisfaction}/5.0</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Globe className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                      <p className="text-sm text-muted-foreground">
                        Last Active
                      </p>
                      <p className="font-semibold text-xs">
                        {widget.lastActive}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="embed" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Embed Code</Label>
                    <div className="bg-gray-900 rounded-lg p-4 relative">
                      <code className="text-green-400 text-sm font-mono break-all">
                        {`<script src="https://your-chat-widget.vercel.app/widget.js" data-widget-id="${widget.id}"></script>`}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        onClick={() => copyEmbedCode(widget.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Copy and paste this code into your website&apos;s HTML,
                      just before the closing &lt;/body&gt; tag.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="customize" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <p className="text-sm capitalize bg-gray-50 p-2 rounded">
                        {widget.position}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: widget.primaryColor }}
                        ></div>
                        <span className="text-sm font-mono">
                          {widget.primaryColor}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Palette className="mr-2 h-4 w-4" />
                    Customize Appearance
                  </Button>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">
                      Detailed analytics coming soon
                    </p>
                    <Button variant="outline" className="mt-2 bg-transparent">
                      View Full Analytics
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
