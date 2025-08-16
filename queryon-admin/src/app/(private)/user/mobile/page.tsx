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
  Smartphone,
  Download,
  Code,
  Settings,
  Play,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Apple,
  Bot,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MobilePage() {
  const [isCreateAppDialogOpen, setIsCreateAppDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    platform: 'ios',
    bundleId: '',
    description: '',
  });

  const mobileApps = [
    {
      id: 1,
      name: 'E-commerce iOS App',
      platform: 'iOS',
      bundleId: 'com.mystore.app',
      status: 'active',
      version: '2.1.0',
      lastUpdated: '2 days ago',
      downloads: 12500,
      rating: 4.8,
      features: [
        'Push notifications',
        'In-app chat',
        'File sharing',
        'Voice messages',
      ],
    },
    {
      id: 2,
      name: 'Support Android App',
      platform: 'Android',
      bundleId: 'com.support.android',
      status: 'active',
      version: '1.9.2',
      lastUpdated: '1 week ago',
      downloads: 8900,
      rating: 4.6,
      features: [
        'Real-time chat',
        'Offline support',
        'Media sharing',
        'Custom themes',
      ],
    },
    {
      id: 3,
      name: 'React Native Demo',
      platform: 'React Native',
      bundleId: 'com.demo.rn',
      status: 'development',
      version: '0.1.0',
      lastUpdated: '3 days ago',
      downloads: 0,
      rating: null,
      features: [
        'Cross-platform',
        'Hot reload',
        'Native performance',
        'Easy integration',
      ],
    },
  ];

  const sdkVersions = [
    {
      platform: 'iOS',
      version: '3.2.1',
      releaseDate: 'Jan 15, 2024',
      size: '2.4 MB',
      minVersion: 'iOS 12.0+',
      changelog: [
        'Bug fixes',
        'Performance improvements',
        'New customization options',
      ],
    },
    {
      platform: 'Android',
      version: '3.1.8',
      releaseDate: 'Jan 12, 2024',
      size: '1.8 MB',
      minVersion: 'Android 5.0+',
      changelog: [
        'Material Design updates',
        'Improved accessibility',
        'Memory optimizations',
      ],
    },
    {
      platform: 'React Native',
      version: '2.0.5',
      releaseDate: 'Jan 10, 2024',
      size: '950 KB',
      minVersion: 'RN 0.60+',
      changelog: [
        'TypeScript support',
        'New hooks API',
        'Better error handling',
      ],
    },
    {
      platform: 'Flutter',
      version: '1.5.2',
      releaseDate: 'Jan 8, 2024',
      size: '1.2 MB',
      minVersion: 'Flutter 2.0+',
      changelog: [
        'Null safety',
        'Widget improvements',
        'Performance enhancements',
      ],
    },
  ];

  const integrationGuides = [
    {
      platform: 'iOS (Swift)',
      difficulty: 'Easy',
      time: '15 min',
      steps: 5,
      description: 'Native iOS integration with Swift',
    },
    {
      platform: 'Android (Kotlin)',
      difficulty: 'Easy',
      time: '20 min',
      steps: 6,
      description: 'Native Android integration with Kotlin',
    },
    {
      platform: 'React Native',
      difficulty: 'Medium',
      time: '25 min',
      steps: 7,
      description: 'Cross-platform React Native integration',
    },
    {
      platform: 'Flutter',
      difficulty: 'Medium',
      time: '30 min',
      steps: 8,
      description: 'Flutter plugin integration',
    },
    {
      platform: 'Xamarin',
      difficulty: 'Hard',
      time: '45 min',
      steps: 10,
      description: 'Microsoft Xamarin integration',
    },
  ];

  const handleCreateApp = () => {
    toast(`${newApp.name} has been created successfully.`);
    setIsCreateAppDialogOpen(false);
    setNewApp({
      name: '',
      platform: 'ios',
      bundleId: '',
      description: '',
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
      case 'development':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Code className="h-3 w-3 mr-1" />
            Development
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="outline">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ios':
        return <Apple className="h-4 w-4" />;
      case 'android':
        return <Bot className="h-4 w-4" />;
      case 'react native':
        return <Code className="h-4 w-4" />;
      case 'flutter':
        return <Zap className="h-4 w-4" />;
      default:
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mobile SDK</h2>
          <p className="text-muted-foreground">
            Integrate ChatWidget into your mobile applications
          </p>
        </div>
        <Dialog
          open={isCreateAppDialogOpen}
          onOpenChange={setIsCreateAppDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Smartphone className="mr-2 h-4 w-4" />
              New Mobile App
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Mobile App</DialogTitle>
              <DialogDescription>
                Set up a new mobile application with ChatWidget integration.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app-name">App Name</Label>
                <Input
                  id="app-name"
                  placeholder="e.g., My Store App"
                  value={newApp.name}
                  onChange={(e) =>
                    setNewApp({ ...newApp, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    value={newApp.platform}
                    onChange={(e) =>
                      setNewApp({ ...newApp, platform: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="ios">iOS</option>
                    <option value="android">Android</option>
                    <option value="react-native">React Native</option>
                    <option value="flutter">Flutter</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bundle-id">Bundle ID</Label>
                  <Input
                    id="bundle-id"
                    placeholder="com.company.app"
                    value={newApp.bundleId}
                    onChange={(e) =>
                      setNewApp({ ...newApp, bundleId: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your mobile app..."
                  value={newApp.description}
                  onChange={(e) =>
                    setNewApp({ ...newApp, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateAppDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateApp}>Create App</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Apps</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mobileApps.length}</div>
            <p className="text-xs text-muted-foreground">Active integrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21.4K</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">User satisfaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SDK Version</CardTitle>
            <Code className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2.1</div>
            <p className="text-xs text-muted-foreground">Latest release</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apps">My Apps</TabsTrigger>
          <TabsTrigger value="sdk">SDK Downloads</TabsTrigger>
          <TabsTrigger value="integration">Integration Guides</TabsTrigger>
          <TabsTrigger value="testing">Testing Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="space-y-4">
          <div className="grid gap-6">
            {mobileApps.map((app) => (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        {getPlatformIcon(app.platform)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{app.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{app.platform}</Badge>
                          <span className="text-sm text-muted-foreground">
                            v{app.version}
                          </span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Download className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <p className="text-sm text-muted-foreground">Downloads</p>
                      <p className="font-semibold">
                        {app.downloads.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">{app.rating || 'N/A'}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Settings className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Updated</p>
                      <p className="font-semibold text-xs">{app.lastUpdated}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Bundle ID</h4>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {app.bundleId}
                        </code>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {app.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="h-4 w-4 mr-2" />
                        View Code
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sdk" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {sdkVersions.map((sdk, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-purple-50">
                        {getPlatformIcon(sdk.platform)}
                      </div>
                      <div>
                        <CardTitle>{sdk.platform} SDK</CardTitle>
                        <CardDescription>Version {sdk.version}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Latest
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Release Date</p>
                        <p className="font-medium">{sdk.releaseDate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Size</p>
                        <p className="font-medium">{sdk.size}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Min Version</p>
                        <p className="font-medium">{sdk.minVersion}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">What&2apos;s New</h4>
                      <ul className="space-y-1">
                        {sdk.changelog.map((change, changeIndex) => (
                          <li
                            key={changeIndex}
                            className="text-sm text-muted-foreground flex items-center"
                          >
                            <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download SDK
                      </Button>
                      <Button variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrationGuides.map((guide, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                      {getPlatformIcon(guide.platform)}
                    </div>
                    <Badge className={getDifficultyColor(guide.difficulty)}>
                      {guide.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{guide.platform}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {guide.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{guide.time}</span>
                    <span>{guide.steps} steps</span>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    View Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Device Testing</CardTitle>
                <CardDescription>
                  Test your mobile integration on real devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Apple className="h-5 w-5" />
                      <div>
                        <p className="font-medium">iPhone 15 Pro</p>
                        <p className="text-sm text-muted-foreground">
                          iOS 17.2
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800"
                    >
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Samsung Galaxy S24</p>
                        <p className="text-sm text-muted-foreground">
                          Android 14
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">In Use</Badge>
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Start Testing Session
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simulator Testing</CardTitle>
                <CardDescription>
                  Quick testing with device simulators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="h-16 flex flex-col bg-transparent"
                    >
                      <Apple className="h-5 w-5 mb-1" />
                      <span className="text-xs">iOS Simulator</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-16 flex flex-col bg-transparent"
                    >
                      <Bot className="h-5 w-5 mb-1" />
                      <span className="text-xs">Android Emulator</span>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-url">Test URL</Label>
                    <Input
                      id="test-url"
                      placeholder="https://your-app.com/test"
                      defaultValue="https://demo.chatwidget.com"
                    />
                  </div>
                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Launch Simulator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
