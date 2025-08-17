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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
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
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Copy,
  MessageSquare,
  Clock,
  Users,
  Mail,
  Bell,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WorkflowsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: 'message_received',
    enabled: true,
  });

  const workflows = [
    {
      id: 1,
      name: 'Welcome New Visitors',
      description: 'Automatically greet new visitors with a welcome message',
      trigger: 'visitor_arrives',
      status: 'active',
      executions: 1250,
      successRate: 98.5,
      lastRun: '2 minutes ago',
      steps: [
        { type: 'delay', duration: '3 seconds' },
        { type: 'message', content: 'Welcome! How can I help you today?' },
        {
          type: 'collect_email',
          prompt: 'Would you like to subscribe to updates?',
        },
      ],
    },
    {
      id: 2,
      name: 'Lead Qualification',
      description: 'Qualify leads based on their responses and company size',
      trigger: 'email_collected',
      status: 'active',
      executions: 890,
      successRate: 85.2,
      lastRun: '5 minutes ago',
      steps: [
        { type: 'ask_question', question: "What's your company size?" },
        { type: 'condition', rule: 'company_size > 50' },
        { type: 'tag', value: 'qualified_lead' },
        { type: 'notify', recipient: 'sales@company.com' },
      ],
    },
    {
      id: 3,
      name: 'Support Ticket Creation',
      description: 'Create support tickets for technical questions',
      trigger: 'keyword_detected',
      status: 'paused',
      executions: 456,
      successRate: 92.1,
      lastRun: '1 hour ago',
      steps: [
        { type: 'detect_intent', intent: 'technical_support' },
        { type: 'create_ticket', priority: 'medium' },
        {
          type: 'message',
          content:
            "I've created a support ticket for you. Our team will respond soon.",
        },
      ],
    },
  ];

  const templates = [
    {
      name: 'Customer Onboarding',
      description: 'Guide new customers through your product',
      category: 'Onboarding',
      steps: 5,
    },
    {
      name: 'Feedback Collection',
      description: 'Collect customer feedback after interactions',
      category: 'Feedback',
      steps: 3,
    },
    {
      name: 'Appointment Booking',
      description: 'Help customers book appointments or demos',
      category: 'Sales',
      steps: 4,
    },
    {
      name: 'FAQ Automation',
      description: 'Automatically answer frequently asked questions',
      category: 'Support',
      steps: 2,
    },
  ];

  const handleCreateWorkflow = () => {
    toast(`${newWorkflow.name} has been created successfully.`);
    setIsCreateDialogOpen(false);
    setNewWorkflow({
      name: '',
      description: '',
      trigger: 'message_received',
      enabled: true,
    });
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
      case 'paused':
        return (
          <Badge variant="secondary">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'delay':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'collect_email':
        return <Mail className="h-4 w-4 text-green-600" />;
      case 'notify':
        return <Bell className="h-4 w-4 text-purple-600" />;
      case 'tag':
        return <Users className="h-4 w-4 text-pink-600" />;
      default:
        return <Zap className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Automated Workflows
          </h2>
          <p className="text-muted-foreground">
            Create automated sequences to engage visitors and qualify leads
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Set up an automated workflow to engage with your visitors and
                customers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workflow Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Welcome New Visitors"
                  value={newWorkflow.name}
                  onChange={(e) =>
                    setNewWorkflow({ ...newWorkflow, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this workflow does..."
                  value={newWorkflow.description}
                  onChange={(e) =>
                    setNewWorkflow({
                      ...newWorkflow,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger</Label>
                <Select
                  value={newWorkflow.trigger}
                  onValueChange={(value) =>
                    setNewWorkflow({ ...newWorkflow, trigger: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visitor_arrives">
                      When visitor arrives
                    </SelectItem>
                    <SelectItem value="message_received">
                      When message is received
                    </SelectItem>
                    <SelectItem value="email_collected">
                      When email is collected
                    </SelectItem>
                    <SelectItem value="keyword_detected">
                      When keyword is detected
                    </SelectItem>
                    <SelectItem value="time_based">
                      Time-based trigger
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={newWorkflow.enabled}
                  onCheckedChange={(checked) =>
                    setNewWorkflow({ ...newWorkflow, enabled: checked })
                  }
                />
                <Label htmlFor="enabled">Enable workflow immediately</Label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow}>Create Workflow</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workflows
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Executions
            </CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,596</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.9%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              Average execution time
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">My Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="grid gap-6">
            {workflows.map((workflow) => (
              <Card
                key={workflow.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <Zap className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {workflow.name}
                        </CardTitle>
                        <CardDescription>
                          {workflow.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(workflow.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Play className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <p className="text-sm text-muted-foreground">
                        Executions
                      </p>
                      <p className="font-semibold">
                        {workflow.executions.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm text-muted-foreground">
                        Success Rate
                      </p>
                      <p className="font-semibold">{workflow.successRate}%</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                      <p className="text-sm text-muted-foreground">Last Run</p>
                      <p className="font-semibold text-xs">
                        {workflow.lastRun}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Workflow Steps</h4>
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                      {workflow.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 flex-shrink-0"
                        >
                          <div className="flex items-center space-x-2 bg-white border rounded-lg p-3 min-w-[200px]">
                            {getStepIcon(step.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium capitalize">
                                {step.type.replace('_', ' ')}
                              </p>
                              {/* <p className="text-xs text-muted-foreground">
                                {step. ||
                                  step.duration ||
                                  step.question ||
                                  step.value ||
                                  step.intent ||
                                  'Action'}
                              </p> */}
                            </div>
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        Trigger: {workflow.trigger.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={
                          workflow.status === 'active'
                            ? 'text-orange-600'
                            : 'text-green-600'
                        }
                      >
                        {workflow.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                      <Zap className="h-5 w-5 text-purple-600" />
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {template.steps} steps
                    </span>
                    <Button size="sm" variant="outline">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>
                  Success rates by workflow type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Welcome Messages</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: '98%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Lead Qualification</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Support Automation</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: '92%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execution Trends</CardTitle>
                <CardDescription>Workflow executions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="text-sm font-medium">
                      1,234 executions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Week</span>
                    <span className="text-sm font-medium">
                      1,089 executions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Growth Rate</span>
                    <span className="text-sm font-medium text-green-600">
                      +13.3%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
