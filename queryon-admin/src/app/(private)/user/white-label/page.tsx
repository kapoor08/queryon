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
  Upload,
  Eye,
  Copy,
  Settings,
  Globe,
  Palette,
  ImageIcon,
  CheckCircle,
  Building,
} from 'lucide-react';
import { toast } from 'sonner';

export default function WhiteLabelPage() {
  const [isCustomDomainDialogOpen, setIsCustomDomainDialogOpen] =
    useState(false);
  const [brandingSettings, setBrandingSettings] = useState({
    companyName: 'Your Company',
    companyLogo: '',
    primaryColor: '#6366F1',
    secondaryColor: '#8B5CF6',
    customDomain: '',
    hideAttribution: false,
    customFooter: '',
    customCSS: '',
  });

  const whitelabelPlans = [
    {
      name: 'Basic White Label',
      price: '$99/month',
      features: [
        'Remove ChatWidget branding',
        'Custom logo upload',
        'Basic color customization',
        'Custom domain support',
        'Email support',
      ],
      current: false,
    },
    {
      name: 'Professional White Label',
      price: '$199/month',
      features: [
        'Everything in Basic',
        'Advanced theme customization',
        'Custom CSS injection',
        'White-label mobile apps',
        'Priority support',
        'Custom documentation',
      ],
      current: true,
    },
    {
      name: 'Enterprise White Label',
      price: 'Custom',
      features: [
        'Everything in Professional',
        'Complete source code access',
        'On-premise deployment',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      current: false,
    },
  ];

  const customDomains = [
    {
      domain: 'chat.yourcompany.com',
      status: 'active',
      sslStatus: 'valid',
      lastVerified: '2 hours ago',
    },
    {
      domain: 'support.mystore.com',
      status: 'pending',
      sslStatus: 'pending',
      lastVerified: 'Pending verification',
    },
  ];

  const brandingPresets = [
    {
      name: 'Corporate Blue',
      primaryColor: '#1E40AF',
      secondaryColor: '#3B82F6',
      preview: 'bg-blue-600',
    },
    {
      name: 'Modern Purple',
      primaryColor: '#7C3AED',
      secondaryColor: '#A855F7',
      preview: 'bg-purple-600',
    },
    {
      name: 'Professional Green',
      primaryColor: '#059669',
      secondaryColor: '#10B981',
      preview: 'bg-green-600',
    },
    {
      name: 'Elegant Black',
      primaryColor: '#1F2937',
      secondaryColor: '#374151',
      preview: 'bg-gray-800',
    },
  ];

  const handleAddCustomDomain = () => {
    toast('Your custom domain has been added and is being verified.');
    setIsCustomDomainDialogOpen(false);
  };

  const handleBrandingChange = (key: string, value: string | boolean) => {
    setBrandingSettings({ ...brandingSettings, [key]: value });
    toast('Your white-label settings have been saved.');
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
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'valid':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Valid
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
          <h2 className="text-3xl font-bold tracking-tight">White Label</h2>
          <p className="text-muted-foreground">
            Customize ChatWidget with your own branding and domain
          </p>
        </div>
        <Dialog
          open={isCustomDomainDialogOpen}
          onOpenChange={setIsCustomDomainDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Globe className="mr-2 h-4 w-4" />
              Add Custom Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Domain</DialogTitle>
              <DialogDescription>
                Add your own domain to host the ChatWidget interface with your
                branding.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="chat.yourcompany.com"
                  value={brandingSettings.customDomain}
                  onChange={(e) =>
                    setBrandingSettings({
                      ...brandingSettings,
                      customDomain: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">DNS Configuration Required</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Add the following CNAME record to your DNS settings:
                </p>
                <div className="bg-white p-2 rounded border font-mono text-sm">
                  CNAME chat.yourcompany.com → chatwidget.com
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCustomDomainDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddCustomDomain}>Add Domain</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Domains
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Custom domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brand Assets</CardTitle>
            <ImageIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Uploaded assets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Theme Presets</CardTitle>
            <Palette className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Available themes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
            <Building className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pro</div>
            <p className="text-xs text-muted-foreground">White label enabled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="domains">Custom Domains</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Company Branding</CardTitle>
                <CardDescription>
                  Customize your company information and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={brandingSettings.companyName}
                    onChange={(e) =>
                      handleBrandingChange('companyName', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-logo">Company Logo</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="company-logo"
                      placeholder="Upload logo..."
                      disabled
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-footer">Custom Footer Text</Label>
                  <Textarea
                    id="custom-footer"
                    placeholder="© 2024 Your Company. All rights reserved."
                    value={brandingSettings.customFooter}
                    onChange={(e) =>
                      handleBrandingChange('customFooter', e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      Hide ChatWidget Attribution
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Remove &ldquo;Powered by Queryon&rdquo; text
                    </p>
                  </div>
                  <Switch
                    checked={brandingSettings.hideAttribution}
                    onCheckedChange={(checked) =>
                      handleBrandingChange('hideAttribution', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>
                  Customize the colors to match your brand
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={brandingSettings.primaryColor}
                      onChange={(e) =>
                        handleBrandingChange('primaryColor', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandingSettings.primaryColor}
                      onChange={(e) =>
                        handleBrandingChange('primaryColor', e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={brandingSettings.secondaryColor}
                      onChange={(e) =>
                        handleBrandingChange('secondaryColor', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={brandingSettings.secondaryColor}
                      onChange={(e) =>
                        handleBrandingChange('secondaryColor', e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {brandingPresets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start bg-transparent"
                        onClick={() => {
                          handleBrandingChange(
                            'primaryColor',
                            preset.primaryColor
                          );
                          handleBrandingChange(
                            'secondaryColor',
                            preset.secondaryColor
                          );
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded mr-2 ${preset.preview}`}
                        ></div>
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advanced Customization</CardTitle>
                <CardDescription>
                  Add custom CSS for advanced styling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea
                    id="custom-css"
                    placeholder="/* Add your custom CSS here */
.chat-widget {
  border-radius: 12px;
}"
                    value={brandingSettings.customCSS}
                    onChange={(e) =>
                      handleBrandingChange('customCSS', e.target.value)
                    }
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Changes
                  </Button>
                  <Button className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See how your widget will look with current settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-100 rounded-lg p-4 h-64">
                  <div className="absolute bottom-4 right-4">
                    <div
                      className="bg-white rounded-lg shadow-lg p-3 max-w-xs"
                      style={{
                        borderTop: `3px solid ${brandingSettings.primaryColor}`,
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            backgroundColor: brandingSettings.primaryColor,
                          }}
                        >
                          {brandingSettings.companyName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">
                          {brandingSettings.companyName}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        Hi! How can I help you today?
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          style={{
                            backgroundColor: brandingSettings.primaryColor,
                          }}
                          className="text-white"
                        >
                          Get Started
                        </Button>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </div>
                      {!brandingSettings.hideAttribution && (
                        <p className="text-xs text-gray-400 mt-2">
                          Powered by ChatWidget
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domains</CardTitle>
              <CardDescription>
                Manage your custom domains for white-label hosting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customDomains.map((domain, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Globe className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{domain.domain}</h3>
                        <p className="text-sm text-muted-foreground">
                          Last verified: {domain.lastVerified}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex space-x-2 mb-1">
                          {getStatusBadge(domain.status)}
                          <Badge variant="outline">
                            SSL: {domain.sslStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brandingPresets.map((preset, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg ${preset.preview}`}
                    ></div>
                    <h3 className="font-semibold">{preset.name}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Primary</span>
                      <span className="font-mono">{preset.primaryColor}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Secondary</span>
                      <span className="font-mono">{preset.secondaryColor}</span>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => {
                      handleBrandingChange('primaryColor', preset.primaryColor);
                      handleBrandingChange(
                        'secondaryColor',
                        preset.secondaryColor
                      );
                    }}
                  >
                    Apply Theme
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-3">
            {whitelabelPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.current ? 'border-indigo-200 bg-indigo-50/50' : ''}`}
              >
                {plan.current && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-indigo-600">Current Plan</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? 'outline' : 'default'}
                    disabled={plan.current}
                  >
                    {plan.current
                      ? 'Current Plan'
                      : plan.price === 'Custom'
                        ? 'Contact Sales'
                        : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
