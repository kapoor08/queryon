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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Video,
  Mic,
  Phone,
  Settings,
  Clock,
  Signal,
  Volume2,
  Camera,
  Monitor,
  Headphones,
  Play,
  Pause,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';

export default function VoiceVideoPage() {
  const [voiceSettings, setVoiceSettings] = useState({
    voiceCallsEnabled: true,
    videoCallsEnabled: true,
    screenSharingEnabled: true,
    recordingEnabled: false,
    autoAnswer: false,
    noiseReduction: true,
  });

  const activeCalls = [
    {
      id: 1,
      type: 'video',
      customer: 'Sarah Johnson',
      agent: 'John Doe',
      duration: '00:12:34',
      status: 'active',
      quality: 'excellent',
    },
    {
      id: 2,
      type: 'voice',
      customer: 'Mike Chen',
      agent: 'Sarah Wilson',
      duration: '00:05:21',
      status: 'active',
      quality: 'good',
    },
    {
      id: 3,
      type: 'screen_share',
      customer: 'Emma Davis',
      agent: 'Mike Johnson',
      duration: '00:08:45',
      status: 'active',
      quality: 'excellent',
    },
  ];

  const callHistory = [
    {
      id: 1,
      type: 'video',
      customer: 'Alice Cooper',
      agent: 'John Doe',
      startTime: '2024-01-20 14:30',
      duration: '00:25:12',
      status: 'completed',
      rating: 5,
      recording: true,
    },
    {
      id: 2,
      type: 'voice',
      customer: 'Bob Wilson',
      agent: 'Sarah Wilson',
      startTime: '2024-01-20 13:15',
      duration: '00:18:45',
      status: 'completed',
      rating: 4,
      recording: false,
    },
    {
      id: 3,
      type: 'video',
      customer: 'Carol Davis',
      agent: 'Mike Johnson',
      startTime: '2024-01-20 11:20',
      duration: '00:12:30',
      status: 'missed',
      rating: null,
      recording: false,
    },
  ];

  const deviceStatus = [
    {
      type: 'microphone',
      name: 'Default Microphone',
      status: 'connected',
      quality: 95,
      icon: Mic,
    },
    {
      type: 'camera',
      name: 'HD Webcam',
      status: 'connected',
      quality: 88,
      icon: Camera,
    },
    {
      type: 'speakers',
      name: 'Default Speakers',
      status: 'connected',
      quality: 92,
      icon: Volume2,
    },
    {
      type: 'headset',
      name: 'Bluetooth Headset',
      status: 'disconnected',
      quality: 0,
      icon: Headphones,
    },
  ];

  const handleSettingChange = (setting: string, value: boolean) => {
    setVoiceSettings({ ...voiceSettings, [setting]: value });
    toast(`${setting} has been ${value ? 'enabled' : 'disabled'}.`);
  };

  const getCallTypeBadge = (type: string) => {
    switch (type) {
      case 'video':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Video className="h-3 w-3 mr-1" />
            Video
          </Badge>
        );
      case 'voice':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Mic className="h-3 w-3 mr-1" />
            Voice
          </Badge>
        );
      case 'screen_share':
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            <Monitor className="h-3 w-3 mr-1" />
            Screen Share
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <Signal className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Completed
          </Badge>
        );
      case 'missed':
        return <Badge variant="destructive">Missed</Badge>;
      case 'connected':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Connected
          </Badge>
        );
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-600';
    if (quality >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Voice & Video</h2>
          <p className="text-muted-foreground">
            Manage voice and video calling features for your chat widget
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Audio Settings
          </Button>
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Test Call
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCalls.length}</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Calls Today
            </CardTitle>
            <Video className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Call Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12:34</div>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Quality</CardTitle>
            <Signal className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Excellent quality</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Calls</TabsTrigger>
          <TabsTrigger value="history">Call History</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Calls</CardTitle>
              <CardDescription>
                Currently ongoing voice and video calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-green-50">
                        {call.type === 'video' ? (
                          <Video className="h-5 w-5 text-green-600" />
                        ) : call.type === 'voice' ? (
                          <Mic className="h-5 w-5 text-green-600" />
                        ) : (
                          <Monitor className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{call.customer}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {call.agent}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {call.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getCallTypeBadge(call.type)}
                          {getStatusBadge(call.status)}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Signal className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-muted-foreground capitalize">
                            {call.quality}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>
                Recent voice and video call records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callHistory.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-50">
                        {call.type === 'video' ? (
                          <Video className="h-5 w-5 text-gray-600" />
                        ) : (
                          <Mic className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{call.customer}</h3>
                        <p className="text-sm text-muted-foreground">
                          with {call.agent}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {call.startTime}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Duration: {call.duration}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getCallTypeBadge(call.type)}
                          {getStatusBadge(call.status)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {call.rating && (
                            <div className="flex items-center space-x-1">
                              {renderStars(call.rating)}
                            </div>
                          )}
                          {call.recording && (
                            <Badge variant="outline" className="text-xs">
                              Recorded
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                        {call.recording && (
                          <Button variant="outline" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audio/Video Devices</CardTitle>
              <CardDescription>
                Manage and test your audio and video devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceStatus.map((device, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <device.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{device.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {device.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusBadge(device.status)}
                        </div>
                        {device.status === 'connected' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-muted-foreground">
                              Quality:
                            </span>
                            <span
                              className={`text-xs font-medium ${getQualityColor(device.quality)}`}
                            >
                              {device.quality}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Testing</CardTitle>
              <CardDescription>
                Test your audio and video devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Audio Test</h4>
                  <div className="space-y-2">
                    <Label>Microphone Level</Label>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Mic className="h-4 w-4 mr-2" />
                      Test Mic
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <Volume2 className="h-4 w-4 mr-2" />
                      Test Speakers
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Video Test</h4>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Video className="h-4 w-4 mr-2" />
                    Test Camera
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Voice & Video Settings</CardTitle>
              <CardDescription>
                Configure voice and video calling features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Voice Calls</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to make voice calls
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.voiceCallsEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('voiceCallsEnabled', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Video Calls</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow customers to make video calls
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.videoCallsEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('videoCallsEnabled', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Screen Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow screen sharing during calls
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.screenSharingEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('screenSharingEnabled', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Call Recording</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically record calls for quality assurance
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.recordingEnabled}
                    onCheckedChange={(checked) =>
                      handleSettingChange('recordingEnabled', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto Answer</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically answer incoming calls
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.autoAnswer}
                    onCheckedChange={(checked) =>
                      handleSettingChange('autoAnswer', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Noise Reduction</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable AI-powered noise reduction
                    </p>
                  </div>
                  <Switch
                    checked={voiceSettings.noiseReduction}
                    onCheckedChange={(checked) =>
                      handleSettingChange('noiseReduction', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call Quality Settings</CardTitle>
              <CardDescription>
                Optimize call quality and bandwidth usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Video Quality</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="auto">Auto (Recommended)</option>
                      <option value="high">High (720p)</option>
                      <option value="medium">Medium (480p)</option>
                      <option value="low">Low (360p)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Audio Quality</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="high">High (48kHz)</option>
                      <option value="medium" selected>
                        Medium (44kHz)
                      </option>
                      <option value="low">Low (22kHz)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bandwidth Limit</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="unlimited">Unlimited</option>
                    <option value="high">High (2 Mbps)</option>
                    <option value="medium" selected>
                      Medium (1 Mbps)
                    </option>
                    <option value="low">Low (500 Kbps)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
