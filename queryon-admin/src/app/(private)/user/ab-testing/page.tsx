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
import { Progress } from '@/components/ui/progress';
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
  TestTube,
  Plus,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ABTestingPage() {
  const [isCreateTestDialogOpen, setIsCreateTestDialogOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    metric: 'conversion_rate',
    trafficSplit: 50,
  });

  const abTests = [
    {
      id: 1,
      name: 'Welcome Message Optimization',
      description: 'Testing different welcome messages to improve engagement',
      status: 'running',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      trafficSplit: 50,
      variants: [
        {
          name: 'Control',
          traffic: 50,
          conversions: 245,
          visitors: 1250,
          conversionRate: 19.6,
        },
        {
          name: 'Variant A',
          traffic: 50,
          conversions: 289,
          visitors: 1180,
          conversionRate: 24.5,
        },
      ],
      primaryMetric: 'Conversion Rate',
      confidence: 95,
      winner: 'Variant A',
    },
    {
      id: 2,
      name: 'Button Color Test',
      description: 'Testing blue vs green CTA button colors',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-14',
      trafficSplit: 50,
      variants: [
        {
          name: 'Blue Button',
          traffic: 50,
          conversions: 156,
          visitors: 890,
          conversionRate: 17.5,
        },
        {
          name: 'Green Button',
          traffic: 50,
          conversions: 134,
          visitors: 910,
          conversionRate: 14.7,
        },
      ],
      primaryMetric: 'Click Rate',
      confidence: 87,
      winner: 'Blue Button',
    },
    {
      id: 3,
      name: 'Chat Position Test',
      description: 'Testing bottom-right vs bottom-left widget position',
      status: 'draft',
      startDate: '2024-02-01',
      endDate: '2024-02-28',
      trafficSplit: 60,
      variants: [
        {
          name: 'Bottom Right',
          traffic: 60,
          conversions: 0,
          visitors: 0,
          conversionRate: 0,
        },
        {
          name: 'Bottom Left',
          traffic: 40,
          conversions: 0,
          visitors: 0,
          conversionRate: 0,
        },
      ],
      primaryMetric: 'Engagement Rate',
      confidence: 0,
      winner: null,
    },
  ];

  const testTemplates = [
    {
      name: 'Welcome Message',
      description: 'Test different welcome messages and greetings',
      category: 'Messaging',
      estimatedDuration: '2 weeks',
    },
    {
      name: 'Widget Position',
      description: 'Test different positions for the chat widget',
      category: 'Design',
      estimatedDuration: '1 week',
    },
    {
      name: 'Color Scheme',
      description: 'Test different color combinations',
      category: 'Design',
      estimatedDuration: '10 days',
    },
    {
      name: 'CTA Button Text',
      description: 'Test different call-to-action button texts',
      category: 'Messaging',
      estimatedDuration: '1 week',
    },
  ];

  const handleCreateTest = () => {
    toast(`${newTest.name} has been created successfully.`);
    setIsCreateTestDialogOpen(false);
    setNewTest({
      name: '',
      description: '',
      metric: 'conversion_rate',
      trafficSplit: 50,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Play className="h-3 w-3 mr-1" />
            Running
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case 'paused':
        return (
          <Badge variant="outline">
            <Pause className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600';
    if (confidence >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWinnerBadge = (winner: string | null, variantName: string) => {
    if (winner === variantName) {
      return <Badge className="bg-green-100 text-green-800">Winner</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">A/B Testing</h2>
          <p className="text-muted-foreground">
            Optimize your chat widget with data-driven experiments
          </p>
        </div>
        <Dialog
          open={isCreateTestDialogOpen}
          onOpenChange={setIsCreateTestDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
              <DialogDescription>
                Set up a new A/B test to optimize your chat widget performance.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="test-name">Test Name</Label>
                <Input
                  id="test-name"
                  placeholder="e.g., Welcome Message Test"
                  value={newTest.name}
                  onChange={(e) =>
                    setNewTest({ ...newTest, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="test-description">Description</Label>
                <Input
                  id="test-description"
                  placeholder="Describe what you're testing..."
                  value={newTest.description}
                  onChange={(e) =>
                    setNewTest({ ...newTest, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-metric">Primary Metric</Label>
                <select
                  id="primary-metric"
                  value={newTest.metric}
                  onChange={(e) =>
                    setNewTest({ ...newTest, metric: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="conversion_rate">Conversion Rate</option>
                  <option value="click_rate">Click Rate</option>
                  <option value="engagement_rate">Engagement Rate</option>
                  <option value="response_time">Response Time</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="traffic-split">Traffic Split (%)</Label>
                <Input
                  id="traffic-split"
                  type="number"
                  min="10"
                  max="90"
                  value={newTest.trafficSplit}
                  onChange={(e) =>
                    setNewTest({
                      ...newTest,
                      trafficSplit: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateTestDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTest}>Create Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tests
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
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
            <CardTitle className="text-sm font-medium">Avg Lift</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.5%</div>
            <p className="text-xs text-muted-foreground">
              Conversion improvement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Visitors</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">My Tests</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-6">
            {abTests.map((test) => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <TestTube className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{test.name}</CardTitle>
                        <CardDescription>{test.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(test.status)}
                      {test.confidence > 0 && (
                        <Badge
                          variant="outline"
                          className={getConfidenceColor(test.confidence)}
                        >
                          {test.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Target className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                        <p className="text-sm text-muted-foreground">
                          Primary Metric
                        </p>
                        <p className="font-semibold">{test.primaryMetric}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Users className="h-5 w-5 mx-auto mb-1 text-green-600" />
                        <p className="text-sm text-muted-foreground">
                          Total Visitors
                        </p>
                        <p className="font-semibold">
                          {test.variants
                            .reduce((sum, variant) => sum + variant.visitors, 0)
                            .toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                        <p className="text-sm text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-semibold text-xs">
                          {test.startDate} - {test.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Variants Performance</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {test.variants.map((variant, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium">{variant.name}</h5>
                              <div className="flex items-center space-x-2">
                                {getWinnerBadge(test.winner, variant.name)}
                                <Badge variant="outline">
                                  {variant.traffic}% traffic
                                </Badge>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Visitors</span>
                                <span className="font-medium">
                                  {variant.visitors.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Conversions</span>
                                <span className="font-medium">
                                  {variant.conversions}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Conversion Rate</span>
                                <span className="font-medium">
                                  {variant.conversionRate}%
                                </span>
                              </div>
                              <Progress
                                value={variant.conversionRate}
                                className="h-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Started: {test.startDate}</span>
                        <span>Ends: {test.endDate}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {test.status === 'running' ? (
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : test.status === 'draft' ? (
                          <Button size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Start Test
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testTemplates.map((template, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-blue-100">
                      <TestTube className="h-5 w-5 text-purple-600" />
                    </div>
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {template.estimatedDuration}
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

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Test Performance Summary</CardTitle>
                <CardDescription>
                  Overall performance of your A/B tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tests with Positive Results</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Confidence Level</span>
                    <span className="font-medium">91%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Best Performing Category</span>
                    <Badge variant="outline">Messaging</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  AI-powered suggestions for your next tests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">
                      Test Widget Size
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Your current widget might be too small. Consider testing a
                      larger size.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">
                      Optimize for Mobile
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Mobile conversion rates are 15% lower. Test
                      mobile-specific designs.
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">
                      Personalized Greetings
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Test personalized welcome messages based on user location
                      or behavior.
                    </p>
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
